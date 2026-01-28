import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';
import { User, Shield, CreditCard, Activity, Store, Package, ShoppingCart } from 'lucide-react';
import SellerDashboard from '../components/SellerDashboard';
import SellerInventory from '../components/SellerInventory';
import SellerOrders from '../components/SellerOrders';
import AdminDashboard from '../components/AdminDashboard';
import ActivityLogs from '../components/ActivityLogs';
import OrderList from '../components/OrderList';
import { motion } from 'framer-motion';
import api from '../api/axios';

import toast from 'react-hot-toast';

const Dashboard = () => {
    const { user, updateProfile } = useAuth();
    const location = useLocation();
    
    const [activeTab, setActiveTab] = useState(user?.role === 'admin' ? 'admin' : 'profile');

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tab = params.get('tab');
        if (tab) {
            
            if (tab === 'orders' && user?.role === 'seller') {
                setActiveTab('sales');
            } else {
                setActiveTab(tab);
            }
        }
    }, [location, user]);

    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');

    
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [mfaData, setMfaData] = useState({ secret: '', qrCode: '' });
    const [mfaCode, setMfaCode] = useState('');
    const [sellerEarnings, setSellerEarnings] = useState(0);
    const [isSimulation, setIsSimulation] = useState(true);

    useEffect(() => {
        // Simple check to see if we are in simulation mode
        api.post('/payment/create-intent', { items: [] })
            .then(res => setIsSimulation(res.data.isSimulation))
            .catch(() => { });
    }, []);

    useEffect(() => {
        if (user?.role === 'seller' || user?.role === 'admin') {
            fetchSellerEarnings();
        }
    }, [user]);

    const fetchSellerEarnings = async () => {
        try {
            const { data } = await api.get('/orders/seller/myorders');
            const total = data.data.reduce((acc, order) => acc + (order.sellerTotal || 0), 0);
            setSellerEarnings(total);
        } catch (err) {
            console.error('Failed to fetch seller earnings', err);
        }
    };

    const setupMFA = async () => {
        try {
            const { data } = await api.post('/auth/mfa/setup');
            setMfaData({ secret: data.secret, qrCode: data.qrCode });
            toast.success('MFA Setup Generated');
        } catch (err) {
            console.error(err);
            toast.error('Failed to generate MFA setup');
        }
    };

    const enableMFA = async () => {
        try {
            await api.post('/auth/mfa/enable', { code: mfaCode });
            toast.success('2FA Enabled Successfully!');
            setMfaData({ secret: '', qrCode: '' });
            setMfaCode('');
            // Refetch user to update UI? Ideally force reload or update context
            window.location.reload();
        } catch (err) {
            toast.error('Invalid Code');
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            await updateProfile(name, email);
            toast.success('Profile updated successfully');
        } catch (error) {
            console.error(error);
            toast.error('Failed to update profile');
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        try {
            await api.put('/users/updatepassword', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            toast.success('Password updated successfully');
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to update password');
        }
    };

    return (
        <div style={{ padding: '2rem 0' }}>
            <div className="container">
                <h1 style={{ marginBottom: '2rem', fontSize: '1.875rem' }}>Dashboard</h1>

                <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '2rem' }}>
                    {/* Sidebar */}
                    <div className="card" style={{ padding: '1rem', height: 'fit-content' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <button
                                onClick={() => setActiveTab('profile')}
                                className={`btn ${activeTab === 'profile' ? 'btn-primary' : 'btn-outline'}`}
                                style={{ justifyContent: 'flex-start', width: '100%', border: activeTab === 'profile' ? 'none' : '1px solid transparent' }}
                            >
                                <User size={18} style={{ marginRight: '0.5rem' }} /> Profile
                            </button>
                            <button
                                onClick={() => setActiveTab('security')}
                                className={`btn ${activeTab === 'security' ? 'btn-primary' : 'btn-outline'}`}
                                style={{ justifyContent: 'flex-start', width: '100%', border: activeTab === 'security' ? 'none' : '1px solid transparent' }}
                            >
                                <Shield size={18} style={{ marginRight: '0.5rem' }} /> Security
                            </button>

                            {user.role === 'admin' && (
                                <button
                                    onClick={() => setActiveTab('admin')}
                                    className={`btn ${activeTab === 'admin' ? 'btn-primary' : 'btn-outline'}`}
                                    style={{ justifyContent: 'flex-start', width: '100%', border: activeTab === 'admin' ? 'none' : '1px solid transparent' }}
                                >
                                    <Shield size={18} style={{ marginRight: '0.5rem' }} /> Admin Panel
                                </button>
                            )}

                            {user.role === 'seller' && (
                                <>
                                    <button
                                        onClick={() => setActiveTab('seller')}
                                        className={`btn ${activeTab === 'seller' ? 'btn-primary' : 'btn-outline'}`}
                                        style={{ justifyContent: 'flex-start', width: '100%', border: activeTab === 'seller' ? 'none' : '1px solid transparent' }}
                                    >
                                        <Store size={18} style={{ marginRight: '0.5rem' }} /> My Shop
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('inventory')}
                                        className={`btn ${activeTab === 'inventory' ? 'btn-primary' : 'btn-outline'}`}
                                        style={{ justifyContent: 'flex-start', width: '100%', border: activeTab === 'inventory' ? 'none' : '1px solid transparent' }}
                                    >
                                        <Package size={18} style={{ marginRight: '0.5rem' }} /> My Inventory
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('sales')}
                                        className={`btn ${activeTab === 'sales' ? 'btn-primary' : 'btn-outline'}`}
                                        style={{ justifyContent: 'flex-start', width: '100%', border: activeTab === 'sales' ? 'none' : '1px solid transparent' }}
                                    >
                                        <ShoppingCart size={18} style={{ marginRight: '0.5rem' }} /> Sales History
                                    </button>
                                </>
                            )}
                            <button
                                onClick={() => setActiveTab('orders')}
                                className={`btn ${activeTab === 'orders' ? 'btn-primary' : 'btn-outline'}`}
                                style={{ justifyContent: 'flex-start', width: '100%', border: activeTab === 'orders' ? 'none' : '1px solid transparent' }}
                            >
                                <ShoppingCart size={18} style={{ marginRight: '0.5rem' }} /> {user.role === 'seller' ? 'My Purchases' : 'Orders'}
                            </button>

                            <button
                                onClick={() => setActiveTab('billing')}
                                className={`btn ${activeTab === 'billing' ? 'btn-primary' : 'btn-outline'}`}
                                style={{ justifyContent: 'flex-start', width: '100%', border: activeTab === 'billing' ? 'none' : '1px solid transparent' }}
                            >
                                <CreditCard size={18} style={{ marginRight: '0.5rem' }} /> Billing
                            </button>
                            <button
                                onClick={() => setActiveTab('activity')}
                                className={`btn ${activeTab === 'activity' ? 'btn-primary' : 'btn-outline'}`}
                                style={{ justifyContent: 'flex-start', width: '100%', border: activeTab === 'activity' ? 'none' : '1px solid transparent' }}
                            >
                                <Activity size={18} style={{ marginRight: '0.5rem' }} /> Activity Log
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                    >


                        {activeTab === 'profile' && (
                            <div className="card">
                                <h2 style={{ marginBottom: '1.5rem' }}>Profile Information</h2>
                                <form onSubmit={handleUpdateProfile}>
                                    <div className="input-group">
                                        <label className="input-label">Full Name</label>
                                        <input
                                            type="text"
                                            className="input-field"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label className="input-label">Email Address</label>
                                        <input
                                            type="email"
                                            className="input-field"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                    <button className="btn btn-primary">Save Changes</button>
                                </form>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="card">
                                <h2 style={{ marginBottom: '1.5rem' }}>Security Settings</h2>
                                {/* ... existing security form ... */}
                                <form onSubmit={handlePasswordChange}>
                                    <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Change Password</h3>
                                    <div className="input-group">
                                        <label className="input-label">Current Password</label>
                                        <input
                                            type="password"
                                            className="input-field"
                                            value={passwordData.currentPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label className="input-label">New Password</label>
                                        <input
                                            type="password"
                                            className="input-field"
                                            value={passwordData.newPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label className="input-label">Confirm New Password</label>
                                        <input
                                            type="password"
                                            className="input-field"
                                            value={passwordData.confirmPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                        />
                                    </div>
                                    <button className="btn btn-primary">Update Password</button>
                                </form>

                                {mfaData.qrCode ? (
                                    <div style={{ marginTop: '1rem' }}>
                                        <p style={{ marginBottom: '0.5rem' }}>1. Scan this QR code with your authenticator app (e.g. Google Authenticator).</p>
                                        <img src={mfaData.qrCode} alt="MFA QR Code" style={{ border: '1px solid #e2e8f0', borderRadius: '4px' }} />

                                        <p style={{ margin: '1rem 0 0.5rem' }}>2. Enter the 6-digit code below to confirm.</p>
                                        <div style={{ display: 'flex', gap: '0.5rem', maxWidth: '300px' }}>
                                            <input
                                                type="text"
                                                className="input-field"
                                                placeholder="000000"
                                                maxLength={6}
                                                value={mfaCode}
                                                onChange={(e) => setMfaCode(e.target.value)}
                                            />
                                            <button onClick={enableMFA} className="btn btn-primary">Verify</button>
                                        </div>
                                    </div>
                                ) : (
                                    <button onClick={setupMFA} className="btn btn-outline" disabled={user?.mfaEnabled}>
                                        {user?.mfaEnabled ? '2FA is Enabled' : 'Enable 2FA'}
                                    </button>
                                )}
                            </div>
                        )}

                        {activeTab === 'admin' && user.role === 'admin' && <AdminDashboard />}
                        {activeTab === 'seller' && user.role === 'seller' && <SellerDashboard />}
                        {activeTab === 'inventory' && user.role === 'seller' && <SellerInventory />}
                        {activeTab === 'sales' && user.role === 'seller' && <SellerOrders />}
                        {activeTab === 'orders' && <OrderList />}

                        {activeTab === 'billing' && (
                            <div className="card">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem' }}>
                                    <div>
                                        <h2 style={{ marginBottom: '0.25rem' }}>Billing & Payments</h2>
                                        <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Manage your funds and view transaction history.</p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                            {isSimulation ? 'Mode: Simulation' : 'Mode: Live Stripe'}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Powered by Stripe</div>
                                    </div>
                                </div>

                                <div style={{ marginBottom: '2rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ background: 'white', padding: '1.25rem', borderRadius: '0.75rem', flex: 1, border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                                        <p style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Purchasing Balance</p>
                                        <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b' }}>$0.00</p>
                                    </div>

                                    {(user.role === 'seller' || user.role === 'admin') && (
                                        <div style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', padding: '1.25rem', borderRadius: '0.75rem', flex: 1, color: 'white', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                                            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Total Sales Earnings</p>
                                            <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>${sellerEarnings.toFixed(2)}</p>
                                        </div>
                                    )}
                                </div>

                                <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Transaction History</h3>
                                <OrderList showHeader={false} />
                            </div>
                        )}

                        {activeTab === 'activity' && (
                            <div className="card">
                                <h2 style={{ marginBottom: '1.5rem' }}>Recent Activity</h2>
                                <ActivityLogs />
                            </div>
                        )}

                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
