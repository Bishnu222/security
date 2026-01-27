const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const Product = require('../models/Product');
const Order = require('../models/Order');
const logActivity = require('../utils/logger');


exports.createPaymentIntent = async (req, res, next) => {
    try {
        const { items } = req.body;
        // Items should be [{ id, price }] but secure way is to fetch price from DB

        // Calculate amount from DB to prevent client manipulation
        let totalAmount = 0;
        const products_for_order = [];

        for (const item of items) {
            const product = await Product.findById(item.id);
            if (!product) continue;
            // Check if already sold or out of stock
            if (product.isSold || product.quantity <= 0) {
                return res.status(400).json({ success: false, error: `Product ${product.name} is out of stock` });
            }
            totalAmount += product.price;
            products_for_order.push(product);
        }

        if (totalAmount === 0) {
            return res.status(400).json({ success: false, error: 'No valid items to purchase' });
        }

        // Check for Simulation Mode (if no valid key is provided)
        if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === 'sk_test_placeholder') {
            return res.status(200).json({
                success: true,
                clientSecret: `mock_secret_${Date.now()}`,
                amount: totalAmount,
                isSimulation: true
            });
        }

        // Create PaymentIntent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: totalAmount * 100, // Stripe expects cents
            currency: 'usd',
            metadata: {
                userId: req.user.id,
                productIds: products_for_order.map(p => p._id.toString()).join(',')
            },
            automatic_payment_methods: {
                enabled: true,
            },
        });

        res.status(200).json({
            success: true,
            clientSecret: paymentIntent.client_secret,
            amount: totalAmount
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Confirm Order (Post-Payment)
// @route   POST /api/payment/confirm-order
// @access  Private
exports.confirmOrder = async (req, res, next) => {
    try {
        const { paymentIntentId, items } = req.body;

        // Simulation mode verification
        if (paymentIntentId.startsWith('mock_')) {
            // In simulation, we assume integrity for demo purposes
        } else {
            // Retrieve intent to verify status and integrity
            const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

            if (paymentIntent.status !== 'succeeded') {
                await logActivity(req.user.id, 'PAYMENT_FAILED', `Payment confirmation failed for Intent ${paymentIntentId}`, req);
                return res.status(400).json({ success: false, error: 'Payment not successful' });
            }

            // Integrity Check: Ensure buyer matches the account that paid
            if (paymentIntent.metadata.userId !== req.user.id.toString()) {
                await logActivity(req.user.id, 'SECURITY_ALERT', 'Payment metadata mismatch - Potential fraud attempt', req);
                return res.status(403).json({ success: false, error: 'Payment authorization mismatch' });
            }

            // Integrity Check: Ensure items match the pre-authorized intent
            const authorizedIds = paymentIntent.metadata.productIds.split(',');
            const requestedIds = items.map(i => i.id.toString());
            const isMatch = requestedIds.every(id => authorizedIds.includes(id)) && authorizedIds.length === requestedIds.length;

            if (!isMatch) {
                await logActivity(req.user.id, 'SECURITY_ALERT', 'Order content mismatch - Potential tampering', req);
                return res.status(400).json({ success: false, error: 'Order integrity check failed' });
            }
        }

        // Verify items again and mark as sold
        let totalAmount = 0;
        const orderItems = [];

        for (const item of items) {
            const product = await Product.findById(item.id);
            if (product) {
                // Decrement quantity
                product.quantity = Math.max(0, product.quantity - 1);

                // Mark as sold ONLY if quantity reaches 0
                if (product.quantity === 0) {
                    product.isSold = true;
                }

                await product.save();
                totalAmount += product.price;
                orderItems.push({
                    product: product._id,
                    price: product.price
                });
            }
        }

        const order = await Order.create({
            buyer: req.user.id,
            items: orderItems,
            totalAmount,
            status: 'Completed',
            paymentIntentId
        });

        await logActivity(req.user.id, 'ORDER_PLACED', `Order #${order._id} placed successfully. Amount: $${totalAmount}`, req);

        res.status(201).json({ success: true, data: order });
    } catch (err) {
        next(err);
    }
};
