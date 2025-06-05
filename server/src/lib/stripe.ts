import dotenv from "dotenv";
import Stripe from "stripe";
dotenv.config();

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY not found");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
