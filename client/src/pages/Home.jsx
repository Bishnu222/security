import { useState, useEffect } from 'react';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Lock, CreditCard, UserCheck, ArrowRight } from 'lucide-react';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const { data } = await api.get('/products?limit=4');
            setProducts(data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {/* Hero Section */}
            <section style={{
                padding: '5rem 0',
                textAlign: 'center',
                background: 'linear-gradient(to bottom, #fdfbf7, #f3f4f6)'
            }}>
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '1.5rem', lineHeight: '1.1', color: '#1c1917' }}>
                            Curated Vintage & <br /><span style={{ color: '#d97706' }}>Thrift Finds.</span>
                        </h1>
                        <p style={{ fontSize: '1.25rem', color: '#57534e', maxWidth: '700px', margin: '0 auto 2.5rem' }}>
                            Discover unique, sustainable fashion and secure your style with our premium thrift collection. Authenticated. Clean. One-of-a-kind.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                            <Link to="/shop" className="btn btn-primary" style={{ padding: '0.75rem 2rem', fontSize: '1.125rem', background: '#d97706' }}>Shop Now</Link>
                            <Link to="/register" className="btn btn-outline" style={{ padding: '0.75rem 2rem', fontSize: '1.125rem', background: 'white' }}>Join Community</Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* New Arrivals Section */}
            <section style={{ padding: '5rem 0', background: 'white' }}>
                <div className="container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
                        <div>
                            <h2 style={{ fontSize: '2.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>New Arrivals</h2>
                            <p style={{ color: '#64748b' }}>Check out our latest unique finds.</p>
                        </div>
                        <Link to="/shop" style={{ color: '#d97706', textDecoration: 'none', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            View All Shop <ArrowRight size={18} />
                        </Link>
                    </div>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '3rem' }}>Loading treasures...</div>
                    ) : products.length > 0 ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
                            {products.map(product => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '5rem', background: '#f8fafc', borderRadius: '1rem' }}>
                            <p style={{ color: '#64748b', fontSize: '1.1rem' }}>No products available at the moment. Check back soon!</p>
                            <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '0.5rem' }}>Note: Sold items are automatically removed from display.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Features Section */}
            <section style={{ padding: '5rem 0' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <h2 style={{ fontSize: '2.25rem', fontWeight: '700', marginBottom: '1rem' }}>Why Shop With Us?</h2>
                        <p style={{ color: '#64748b' }}>Sustainable fashion meets secure shopping.</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                        <FeatureCard
                            icon={<Shield size={32} color="#d97706" />}
                            title="Authenticity Guaranteed"
                            description="Every item is verified by our experts so you know exactly what you're buying."
                        />
                        <FeatureCard
                            icon={<UserCheck size={32} color="#d97706" />}
                            title="Sustainable Choice"
                            description="Give clothes a second life and reduce your carbon footprint with every purchase."
                        />
                        <FeatureCard
                            icon={<Lock size={32} color="#d97706" />}
                            title="Secure Transactions"
                            description="Your payment data is protected with enterprise-grade encryption and Stripe integration."
                        />
                        <FeatureCard
                            icon={<CreditCard size={32} color="#d97706" />}
                            title="Buyer Protection"
                            description="If your item doesn't match the description, we've got you covered with easy returns."
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};

const FeatureCard = ({ icon, title, description }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="card"
        style={{ padding: '2rem' }}
    >
        <div style={{ background: '#e0e7ff', width: 'fit-content', padding: '1rem', borderRadius: '1rem', marginBottom: '1.5rem' }}>
            {icon}
        </div>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', fontWeight: '600' }}>{title}</h3>
        <p style={{ color: '#64748b', lineHeight: '1.6' }}>{description}</p>
    </motion.div>
);

export default Home;
