import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '../components/CheckoutForm';
import api from '../api/axios';
import { CreditCard, ShieldCheck } from 'lucide-react';


const stripePromise = loadStripe('pk_test_51O7...REPLACE_WITH_REAL_KEY_OR_MOCK');
// Ideally get this from ENV

const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { items } = location.state || {}; // items: [{id, name, price}]

    const [clientSecret, setClientSecret] = useState('');
    const [isSimulation, setIsSimulation] = useState(false);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        if (!items || items.length === 0) {
            navigate('/shop');
            return;
        }

        // Calculate initial total
        const t = items.reduce((acc, item) => acc + item.price, 0);
        setTotal(t);

        // Create Payment Intent
        api.post('/payment/create-intent', { items: items.map(i => ({ id: i._id })) })
            .then(res => {
                setClientSecret(res.data.clientSecret);
                setIsSimulation(res.data.isSimulation);
            })
            .catch(err => {
                console.error("Payment intent failed", err);
                alert("Could not initiate checkout: " + (err.response?.data?.error || "Unknown Error"));
                navigate('/shop');
            });

    }, [items, navigate]);

    const appearance = {
        theme: 'stripe',
        variables: {
            colorPrimary: '#4f46e5',
        },
    };
    const options = {
        clientSecret,
        appearance,
    };

    return (
        <div style={{ padding: '2rem 0', minHeight: '80vh', background: '#f8fafc' }}>
            <div className="container" style={{ maxWidth: '600px' }}>
                <div className="card">
                    <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <ShieldCheck color="#16a34a" /> Secure Checkout
                    </h2>

                    <div style={{ marginBottom: '2rem', padding: '1rem', background: '#f1f5f9', borderRadius: '0.5rem' }}>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Order Summary</h3>
                        {items && items.map(item => (
                            <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span>{item.name}</span>
                                <span>${item.price}</span>
                            </div>
                        ))}
                        <div style={{ borderTop: '1px solid #cbd5e1', marginTop: '0.5rem', paddingTop: '0.5rem', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                            <span>Total</span>
                            <span>${total}</span>
                        </div>
                    </div>

                    {clientSecret && !isSimulation && (
                        <Elements options={options} stripe={stripePromise}>
                            <CheckoutForm items={items.map(i => ({ id: i._id }))} total={total} />
                        </Elements>
                    )}

                    {clientSecret && isSimulation && (
                        <div style={{ marginTop: '1.5rem', padding: '1.5rem', background: '#fffbeb', borderRadius: '0.5rem', border: '1px solid #fde68a' }}>
                            <div style={{ marginBottom: '1rem', color: '#92400e', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <ShieldCheck size={20} />
                                <strong>Simulation Mode Active</strong>
                            </div>
                            <p style={{ fontSize: '0.875rem', color: '#92400e', marginBottom: '1.5rem' }}>
                                No Stripe keys detected. You can complete this order using a simulated payment for demo purposes.
                            </p>
                            <CheckoutForm items={items.map(i => ({ id: i._id }))} total={total} isSimulation={true} clientSecret={clientSecret} />
                        </div>
                    )}
                </div>
                <div style={{ textAlign: 'center', marginTop: '1rem', color: '#64748b', fontSize: '0.875rem' }}>
                    <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                        <CreditCard size={16} /> Payments processed securely by Stripe. No card info is stored on our servers.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
