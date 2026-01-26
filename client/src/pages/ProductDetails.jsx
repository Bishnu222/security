import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { ArrowLeft, ShoppingBag } from 'lucide-react';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await api.get(`/products/${id}`);
                setProduct(data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    if (loading) return <div className="container" style={{ padding: '2rem' }}>Loading...</div>;
    if (!product) return <div className="container" style={{ padding: '2rem' }}>Product not found</div>;

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <button onClick={() => navigate('/shop')} className="btn btn-outline" style={{ marginBottom: '2rem', border: 'none', paddingLeft: 0 }}>
                <ArrowLeft size={18} style={{ marginRight: '0.5rem' }} /> Back to Shop
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
                <div style={{ background: '#f8fafc', borderRadius: '1rem', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                    {product.image && product.image !== 'no-photo.jpg' ? (
                        <img
                            src={`http://localhost:5000/uploads/${product.image}`}
                            alt={product.name}
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        />
                    ) : (
                        <span style={{ color: '#94a3b8', fontSize: '1.5rem' }}>No Image Available</span>
                    )}
                </div>

                <div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                        <span style={{ background: '#e0e7ff', color: '#4f46e5', padding: '0.25rem 0.75rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: '600' }}>{product.category}</span>
                        <span style={{ background: '#f1f5f9', color: '#64748b', padding: '0.25rem 0.75rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: '600' }}>{product.condition}</span>
                    </div>

                    <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '1rem', lineHeight: 1.1 }}>{product.name}</h1>
                    <p style={{ fontSize: '1.5rem', color: '#4f46e5', fontWeight: '600', marginBottom: '2rem' }}>${product.price}</p>

                    <div style={{ marginBottom: '2rem' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>Description</h3>
                        <p style={{ color: '#64748b', lineHeight: '1.6' }}>{product.description}</p>
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>Details</h3>
                        <ul style={{ listStyle: 'none', color: '#64748b' }}>
                            <li style={{ marginBottom: '0.5rem' }}>• Size: {product.size}</li>
                            <li style={{ marginBottom: '0.5rem' }}>• Stock: {product.quantity} units available</li>
                            <li style={{ marginBottom: '0.5rem' }}>• Listed: {new Date(product.createdAt).toLocaleDateString()}</li>
                        </ul>
                    </div>

                    <button
                        onClick={() => navigate('/checkout', { state: { items: [product] } })}
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '1rem', fontSize: '1.125rem' }}
                        disabled={product.isSold}
                    >
                        <ShoppingBag size={20} style={{ marginRight: '0.5rem' }} />
                        {product.isSold ? 'Sold Out' : 'Buy Now'}
                    </button>
                    <p style={{ fontSize: '0.75rem', color: '#94a3b8', textAlign: 'center', marginTop: '1rem' }}>
                        Secure checkout powered by Stripe.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
