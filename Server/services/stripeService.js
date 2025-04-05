import Stripe from 'stripe';
import APIError, { HttpStatusCode } from '../exception/errorHandler.js';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create a payment intent
export const createPaymentIntent = async (amount, currency = 'usd') => {
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), 
            currency: currency,
            automatic_payment_methods: {
                enabled: true,
            },
        });

        return {
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id
        };
    } catch (error) {
        console.log("error in create payment intent-->", error.message);
        const errorMessage = error.raw ? error.raw.message : error.message;
        throw new APIError(
            'PaymentError',
            HttpStatusCode.BAD_REQUEST,
            true,
            errorMessage
        );
    }
};

// Retrieve payment intent status
export const retrievePaymentIntent = async (paymentIntentId) => {
    try {
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        return paymentIntent;
    } catch (error) {
        const errorMessage = error.raw ? error.raw.message : error.message;
        throw new APIError(
            'PaymentError',
            HttpStatusCode.BAD_REQUEST,
            true,
            errorMessage
        );
    }
};

// Process refund
export const processRefund = async (paymentIntentId, amount = null) => {
    try {
        const refund = await stripe.refunds.create({
            payment_intent: paymentIntentId,
            amount: amount ? Math.round(amount * 100) : undefined, 
        });
        return refund;
    } catch (error) {
        throw new APIError(
            'RefundError',
            HttpStatusCode.BAD_REQUEST,
            true,
            error.message
        );
    }
};

// Handle webhook events
export const handleWebhookEvent = async (rawBody, signature) => {
    try {
        const event = stripe.webhooks.constructEvent(
            rawBody,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );

        switch (event.type) {
            case 'payment_intent.succeeded':
                const paymentIntent = event.data.object;
                // Handle successful payment
                console.log('Payment succeeded:', paymentIntent.id);
                break;

            case 'payment_intent.payment_failed':
                const failedPayment = event.data.object;
                // Handle failed payment
                console.log('Payment failed:', failedPayment.id);
                break;

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        return event;
    } catch (error) {
        throw new APIError(
            'WebhookError',
            HttpStatusCode.BAD_REQUEST,
            true,
            error.message
        );
    }
};

// Create a customer
export const createCustomer = async (email, name, paymentMethodId = null) => {
    try {
        const customerData = {
            email,
            name,
        };

        if (paymentMethodId) {
            customerData.payment_method = paymentMethodId;
        }

        const customer = await stripe.customers.create(customerData);
        return customer;
    } catch (error) {
        throw new APIError(
            'CustomerError',
            HttpStatusCode.BAD_REQUEST,
            true,
            error.message
        );
    }
};