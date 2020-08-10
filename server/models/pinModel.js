const mongoose = require('mongoose');

const pinSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'account',
        required: true
    },
    isViolent: {
        type: Boolean,
        required: true
    },
    coordinates: {
        lat: {
            type: String,
            required: true
        },
        long: {
            type: String,
            required: true
        }
    },
    address: {
        type: String
    },
    protestInfo: String,
    date: {
        type: Date,
        default: Date.now,
        required: true
      }
});

module.exports = {
    Pin: mongoose.model('pins', pinSchema),
    pinSchema
};