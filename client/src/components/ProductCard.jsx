import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const ProductCard = ({ product }) => {
    const navigate = useNavigate();

    return (
        <motion.div
            whileHover={{ y: -5 }}
            style={{
                background: 'white',
                borderRadius: '0.5rem',
                overflow: 'hidden',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                cursor: 'pointer',
                position: 'relative'
            }}
            onClick={() => navigate(`/product/${product._id}`)}
        >
            <div style={{ height: '200px', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
                {product.image && product.image !== 'no-photo.jpg' ? (
                    <img
                        src={`/uploads/${product.image}`}
                        alt={product.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', filter: product.isSold ? 'grayscale(80%)' : 'none' }}
                    />
                ) : (
                    <span style={{ color: '#94a3b8' }}>No Image</span>
                )}

                {product.isSold && (
                    <div style={{
                        position: 'absolute',
                        top: '0',
                        left: '0',
                        width: '100%',
                        height: '100%',
                        background: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: '800',
                        fontSize: '1.25rem',
                        letterSpacing: '2px',
                        zIndex: 2
                    }}>
                        SOLD OUT
                    </div>
                )}
            </div>

            <div style={{ padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', margin: 0 }}>{product.name}</h3>
                    <span style={{ fontWeight: '700', color: '#4f46e5' }}>${product.price}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b' }}>
                    <span>{product.category}</span>
                    <span>{product.condition}</span>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;
