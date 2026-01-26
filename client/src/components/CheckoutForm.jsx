import { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const StripeCheckoutForm = ({ items, total, navigate }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;
        setIsProcessing(true);

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {},
            redirect: 'if_required'
        });

        if (error) {
            setMessage(error.message);
            setIsProcessing(false);
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            try {
                await api.post('/payment/confirm-order', {
                    paymentIntentId: paymentIntent.id,
                    items: items
                });
                setMessage('Payment Successful! Order created.');
                setTimeout(() => navigate('/dashboard?tab=orders'), 2000);
            } catch (err) {
                setMessage('Payment verified but order creation failed.');
                setIsProcessing(false);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
            <PaymentElement />
            <button disabled={isProcessing || !stripe || !elements} className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem' }}>
                {isProcessing ? "Processing..." : `Pay $${total}`}
            </button>
            {message && <div style={{ marginTop: '1rem', color: '#dc2626', fontSize: '0.9rem' }}>{message}</div>}
        </form>
    );
};

const SimulatedCheckoutForm = ({ items, total, clientSecret, navigate }) => {
    const [message, setMessage] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsProcessing(true);
        try {
            await api.post('/payment/confirm-order', {
                paymentIntentId: clientSecret,
                items: items
            });
            setMessage('Simulated Payment Successful! Order created.');
            setTimeout(() => navigate('/dashboard?tab=orders'), 2000);
        } catch (err) {
            setMessage('Simulation failed.');
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
            <button disabled={isProcessing} className="btn btn-primary" style={{ width: '100%', background: '#059669', borderColor: '#059669' }}>
                {isProcessing ? "Processing..." : `Complete Simulated Payment ($${total})`}
            </button>
            {message && <div style={{ marginTop: '1rem', color: '#dc2626', fontSize: '0.9rem' }}>{message}</div>}
        </form>
    );
};

const CheckoutForm = (props) => {
    const navigate = useNavigate();
    if (props.isSimulation) {
        return <SimulatedCheckoutForm {...props} navigate={navigate} />;
    }
    return <StripeCheckoutForm {...props} navigate={navigate} />;
};

export default CheckoutForm;
