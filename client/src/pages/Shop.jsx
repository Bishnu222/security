import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import { Filter } from 'lucide-react';

const Shop = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        category: '',
        condition: ''
    });

    useEffect(() => {
        if (user && (user.role === 'admin' || user.role === 'seller')) {
            navigate('/dashboard');
            return;
        }
        fetchProducts();
    }, [filters]);

    const fetchProducts = async () => {
        try {
            let query = '/products?';
            if (filters.category) query += `category=${filters.category}&`;
            if (filters.condition) query += `condition=${filters.condition}&`;

            const { data } = await api.get(query);
            setProducts(data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.875rem' }}>The Thrift Shop</h1>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <select
                        className="input-field"
                        style={{ width: '150px' }}
                        onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    >
                        <option value="">All Categories</option>
                        <option value="Clothing">Clothing</option>
                        <option value="Accessories">Accessories</option>
                        <option value="Vintage">Vintage</option>
                    </select>
                    <select
                        className="input-field"
                        style={{ width: '150px' }}
                        onChange={(e) => setFilters({ ...filters, condition: e.target.value })}
                    >
                        <option value="">All Conditions</option>
                        <option value="Like New">Like New</option>
                        <option value="Good">Good</option>
                        <option value="Vintage">Vintage</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div>Loading treasures...</div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '2rem' }}>
                    {products.length > 0 ? (
                        products.map(product => (
                            <ProductCard key={product._id} product={product} />
                        ))
                    ) : (
                        <p>No unique finds matching your criteria.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Shop;
