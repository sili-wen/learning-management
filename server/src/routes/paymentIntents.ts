import { getAuth } from "@clerk/fastify";
import { FastifyInstance, FastifyRequest } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import createError from "http-errors";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { stripe } from "~/src/lib/stripe";

const tags = ["payment intent"];

const PaymentIntent = z.object({
  amount: z.number().int().nonnegative(),
});

export const createPaymentIntentHandler = async (req: FastifyRequest) => {
  const { userId } = getAuth(req);
  if (!userId) {
    throw createError(StatusCodes.UNAUTHORIZED, "User not authenticated.");
  }

  let { amount } = req.body as z.infer<typeof PaymentIntent>;

  if (amount === 0) {
    amount = 50;
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never",
      },
    });

    return { clientSecret: paymentIntent.client_secret };
  } catch (error) {
    console.log("Error calling Stripe", error);
    throw createError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Payment error. No charge was made."
    );
  }
};

export const paymentIntentRoutes = async (fastify: FastifyInstance) => {
  fastify.withTypeProvider<ZodTypeProvider>().post(
    "/payment-intent",
    {
      schema: { body: PaymentIntent, tags },
    },
    createPaymentIntentHandler
  );
};
