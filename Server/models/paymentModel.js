import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
    paymentIntentId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        required: true,
        default: 'usd'
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'succeeded', 'failed', 'refunded', 'partially_refunded'],
        default: 'pending'
    },
    customerId: {
        type: String,
        index: true
    },
    customerEmail: {
        type: String
    },
    customerName: {
        type: String
    },
    metadata: {
        type: Map,
        of: String,
        default: {}
    },
    refundAmount: {
        type: Number,
        default: 0
    },
    refundStatus: {
        type: String,
        enum: ['none', 'partial', 'full'],
        default: 'none'
    },
    errorMessage: {
        type: String
    }
}, {
    timestamps: true
});


paymentSchema.index({ createdAt: -1 });
paymentSchema.index({ status: 1, createdAt: -1 });

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;