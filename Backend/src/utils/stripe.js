import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPaymentIntent = async (
  amount,
  currency = "usd",
  metadata = {},
) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // amount in cents
      currency,
      metadata,
    });

    return paymentIntent;
  } catch (error) {
    throw new Error(`Stripe payment intent creation failed: ${error.message}`);
  }
};

export const getPaymentIntent = async (intentId) => {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(intentId);
    return paymentIntent;
  } catch (error) {
    throw new Error(`Failed to retrieve payment intent: ${error.message}`);
  }
};

export const constructWebhookEvent = (body, signature, secret) => {
  try {
    const event = stripe.webhooks.constructEvent(body, signature, secret);
    return event;
  } catch (error) {
    throw new Error(`Webhook signature verification failed: ${error.message}`);
  }
};

export default stripe;
