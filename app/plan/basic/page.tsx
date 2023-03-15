const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

import { redirect } from 'next/navigation';
const priceId = process.env.STRIPE_BILLING_BASIC_PRICE_ID;

export default async function() {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: priceId,
        quantity: 1,
      }
    ],
    mode: 'subscription',
    success_url: `${process.env.NEXT_PUBLIC_URL}/restricted?subscribed=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/plan`,
  });

  redirect(session.url);
}
