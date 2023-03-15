// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default (req, res) => {
  if (req.method === 'GET') {
    createCheckoutSession(req, res);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};

function createCheckoutSession(req, res) {
  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  // Since there is just one plan, it's fine to have this here instead of being passed from the client
  const priceId = process.env.STRIPE_PRICE_ID;

  const session = stripe.checkout.sessions.create({
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

  res.redirect(303, session.url);
}