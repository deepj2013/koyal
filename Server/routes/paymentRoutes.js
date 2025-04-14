import express from 'express';
import { adminAuth } from '../middleware/adminAuth.js';
import { createPaymentIntent, retrievePaymentIntent, processRefund, handleWebhookEvent, createCustomer } from '../services/stripeService.js';

const router = express.Router();

// Create payment intent
router.post('/create-payment', async (req, res) => {
    try {
        const { amount, currency = 'usd' } = req.body;
        const paymentIntent = await createPaymentIntent(amount, currency);
        res.json(paymentIntent);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get payment status
router.get('/payment/:paymentIntentId', async (req, res) => {
    try {
        const { paymentIntentId } = req.params;
        const paymentIntent = await retrievePaymentIntent(paymentIntentId);
        res.json(paymentIntent);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Process refund
router.post('/refund', adminAuth, async (req, res) => {
    try {
        const { paymentIntentId, amount } = req.body;
        const refund = await processRefund(paymentIntentId, amount);
        res.json(refund);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Webhook handler
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    try {
        const sig = req.headers['stripe-signature'];
        const event = await handleWebhookEvent(req.body, sig);
        res.json({ received: true, type: event.type });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Create customer
router.post('/create-customer', async (req, res) => {
    try {
        const { email, name, paymentMethodId } = req.body;
        const customer = await createCustomer(email, name, paymentMethodId);
        res.json(customer);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

export default router;