import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <nav style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '1rem 0' }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: '#0f172a', gap: '0.5rem', fontWeight: 'bold', fontSize: '1.25rem' }}>
                    <Shield size={24} color="#d97706" />
                    ThriftSecure
                </Link>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    {(!user || user.role === 'user') && (
                        <Link to="/shop" className="btn btn-outline" style={{ textDecoration: 'none', marginRight: '0.5rem' }}>Shop</Link>
                    )}
                    {user ? (
                        <>
                            <Link to="/dashboard" className="btn btn-outline" style={{ textDecoration: 'none' }}>Dashboard</Link>
                            <button onClick={handleLogout} className="btn btn-primary">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn btn-outline" style={{ textDecoration: 'none' }}>Login</Link>
                            <Link to="/register" className="btn btn-primary" style={{ textDecoration: 'none' }}>Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
