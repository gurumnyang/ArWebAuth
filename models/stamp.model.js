const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stampSchema = new Schema({
    market: {
        type: Schema.Types.ObjectId,
        ref: 'market',
    },
    stampType: {
        type: Schema.Types.ObjectId,
        ref: 'stampPolicy',
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
    },
    count: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('stamp', stampSchema);