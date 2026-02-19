import express from "express";
import { constructWebhookEvent } from "../utils/stripe.js";
import Donation from "../models/Donation.js";

const router = express.Router();

router.post("/webhook", async (req, res) => {
  

  const signature = req.headers["stripe-signature"];

  try {
    const event = constructWebhookEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    switch (event.type) {

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;

        await Donation.findOneAndUpdate(
          { stripe_payment_intent_id: paymentIntent.id },
          {
            payment_status: "success",
            stripe_charge_id: paymentIntent.latest_charge, // safer
            payment_timestamp: new Date(),
          }
        );

        console.log(`✅ Payment succeeded: ${paymentIntent.id}`);
        break;
      }

      case "payment_intent.payment_failed": {
        const failedIntent = event.data.object;

        await Donation.findOneAndUpdate(
          { stripe_payment_intent_id: failedIntent.id },
          { payment_status: "failed" }
        );

        console.log(`❌ Payment failed: ${failedIntent.id}`);
        break;
      }

      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });

  } catch (error) {
    console.error(`❌ Webhook error: ${error.message}`);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
});

export default router;
