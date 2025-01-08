const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stampRuleSchema = new Schema({
    market: {
        type: Schema.Types.ObjectId,
        ref: 'Market',
        required: true
    },
    name: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 20
    },
    requiredStamps: {
        type: Number,
        required: true,
        min: 1
    },
    reward: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 100
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('stampRule', stampRuleSchema);