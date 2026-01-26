const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a product name'],
        trim: true,
        maxlength: 100
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
        maxlength: 1000
    },
    price: {
        type: Number,
        required: [true, 'Please add a price']
    },
    category: {
        type: String,
        required: [true, 'Please select a category'],
        enum: ['Clothing', 'Accessories', 'Shoes', 'Home', 'Vintage']
    },
    condition: {
        type: String,
        required: [true, 'Please specify the condition'],
        enum: ['New with tags', 'Like New', 'Good', 'Fair', 'Vintage']
    },
    size: {
        type: String,
        default: 'One Size'
    },
    image: {
        type: String,
        default: 'no-photo.jpg'
    },
    quantity: {
        type: Number,
        required: [true, 'Please add a quantity'],
        default: 1,
        min: [0, 'Quantity cannot be less than 0']
    },
    isSold: {
        type: Boolean,
        default: false
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    addedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Product', productSchema);
