import { useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const SellerDashboard = () => {
    const [newItem, setNewItem] = useState({
        name: '',
        price: '',
        category: 'Clothing',
        condition: 'Good',
        description: '',
        size: 'One Size',
        quantity: 1
    });

    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);

    const sizeMapping = {
        'Clothing': ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Other'],
        'Shoes': ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45'],
        'Accessories': ['One Size', 'Other'],
        'Home': ['One Size', 'Small', 'Medium', 'Large', 'Other'],
        'Vintage': ['One Size', 'XS', 'S', 'M', 'L', 'XL', 'Other']
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'category') {
            
            setNewItem({
                ...newItem,
                category: value,
                size: sizeMapping[value][0]
            });
        } else {
            setNewItem({ ...newItem, [name]: value });
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        if (file) {
            setPreview(URL.createObjectURL(file));
        } else {
            setPreview(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', newItem.name);
        formData.append('price', newItem.price);
        formData.append('category', newItem.category);
        formData.append('condition', newItem.condition);
        formData.append('size', newItem.size);
        formData.append('description', newItem.description);
        formData.append('quantity', newItem.quantity);
        if (image) {
            formData.append('image', image);
        }

        try {
            await api.post('/products', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success('Item listed successfully! Pending approval.');
            setNewItem({ name: '', price: '', category: 'Clothing', condition: 'Good', description: '', size: 'One Size', quantity: 1 });
            setImage(null);
            setPreview(null);
        } catch (err) {
            console.error(err);
            toast.error('Failed to list item');
        }
    };

    return (
        <div className="card">
            <h2 style={{ marginBottom: '1.5rem' }}>List New Item</h2>

            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label className="input-label">Item Name</label>
                    <input name="name" className="input-field" value={newItem.name} onChange={handleChange} required />
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div className="input-group" style={{ flex: 1 }}>
                        <label className="input-label">Price ($)</label>
                        <input name="price" type="number" className="input-field" value={newItem.price} onChange={handleChange} required />
                    </div>
                    <div className="input-group" style={{ flex: 1 }}>
                        <label className="input-label">Quantity</label>
                        <input name="quantity" type="number" min="1" className="input-field" value={newItem.quantity} onChange={handleChange} required />
                    </div>
                    <div className="input-group" style={{ flex: 1 }}>
                        <label className="input-label">Category</label>
                        <select name="category" className="input-field" value={newItem.category} onChange={handleChange}>
                            <option value="Clothing">Clothing</option>
                            <option value="Accessories">Accessories</option>
                            <option value="Shoes">Shoes</option>
                            <option value="Home">Home</option>
                            <option value="Vintage">Vintage</option>
                        </select>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div className="input-group" style={{ flex: 1 }}>
                        <label className="input-label">Condition</label>
                        <select name="condition" className="input-field" value={newItem.condition} onChange={handleChange}>
                            <option value="New with tags">New with tags</option>
                            <option value="Like New">Like New</option>
                            <option value="Good">Good</option>
                            <option value="Fair">Fair</option>
                            <option value="Vintage">Vintage</option>
                        </select>
                    </div>
                    <div className="input-group" style={{ flex: 1 }}>
                        <label className="input-label">Size</label>
                        <select name="size" className="input-field" value={newItem.size} onChange={handleChange}>
                            {sizeMapping[newItem.category].map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="input-group">
                    <label className="input-label">Product Image</label>
                    <input type="file" className="input-field" onChange={handleImageChange} accept="image/*" />
                    {preview && (
                        <div style={{ marginTop: '0.5rem' }}>
                            <img src={preview} alt="Preview" style={{ width: '100%', maxWidth: '200px', height: 'auto', borderRadius: '4px', border: '1px solid #e2e8f0' }} />
                        </div>
                    )}
                </div>
                <div className="input-group">
                    <label className="input-label">Description</label>
                    <textarea name="description" className="input-field" value={newItem.description} onChange={handleChange} rows="3" required></textarea>
                </div>
                <button className="btn btn-primary">List Item</button>
            </form>
        </div>
    );
};

export default SellerDashboard;
