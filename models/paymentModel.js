const mongoose = require('mongoose')
const paymentSchema = new mongoose.Schema({
    customer: {
        type: 'string',
        required: true,
        trim: true
    },
    phone: {
        type: 'string',
        required: true,
        unique: true
    },
    address: {
        type: 'string',
        required: true
    },
    cart: {
        type: Array,
        default: []
    },
    status: {
        type: Boolean,
        default: false
    },
},{
    timestamps: true
})
module.exports = mongoose.model('Payments',paymentSchema)