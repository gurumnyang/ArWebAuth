const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const marketSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        minlength: 1,
        maxlength:20
    },
    address: {
        type: String,
        required: true
    },
    //@todo support soon
    coordinate: {
        latitude: {
            type: Number,
        },
        longitude: {
            type: Number,
        }
    },
    stampPolicies: [{
        type: Schema.Types.ObjectId,
        ref: 'stampPolicy'
    }],
    products: [{
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            auto: true
        },
        name: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 20
        },
        price: {
            type: Number,
            required: true,
            min: 0
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('market', marketSchema);