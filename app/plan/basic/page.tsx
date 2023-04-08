const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

import { getServerSession } from "next-auth/next";
import { redirect } from 'next/navigation';
import { authOptions } from '../../../pages/api/auth/[...nextauth]';
const priceId = process.env.STRIPE_BILLING_BASIC_PRICE_ID;

export default async function() {
  const serverSession = await getServerSession(authOptions);
  const user = serverSession!.user;
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
    client_reference_id: user.id,
  });

  redirect(session.url);
}
