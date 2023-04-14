import getRawBody from 'raw-body';
import type { Stripe } from 'stripe';
import { db } from '../../firebase-admin';
import { UserSubscription } from '../../types';

export enum StripeWebhooks {
  AsyncPaymentSuccess = 'checkout.session.async_payment_succeeded',
  Completed = 'checkout.session.completed',
  PaymentFailed = 'checkout.session.async_payment_failed',
  SubscriptionDeleted = 'customer.subscription.deleted',
  SubscriptionUpdated = 'customer.subscription.updated',
}

const STRIPE_SIGNATURE_HEADER = 'stripe-signature';

// NB: we disable body parser to receive the raw body string. The raw body
// is fundamental to verify that the request is genuine
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function(req, res) {
  const stripe: Stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, { apiVersion: '2020-08-27' });

  const signature = req.headers[STRIPE_SIGNATURE_HEADER];
  const rawBody = await getRawBody(req);
  const event = stripe.webhooks.constructEvent(
    rawBody,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!
  );

  let session, subscription;
  switch (event.type) {
    case StripeWebhooks.Completed:
      session = event.data.object as Stripe.Checkout.Session;
      const subscriptionId = session.subscription as string;
      subscription = await stripe.subscriptions.retrieve(subscriptionId);

      await onCheckoutCompleted(session, subscription);
    break;
    case StripeWebhooks.SubscriptionDeleted:
      subscription = event.data.object as Stripe.Subscription;
      await onSubscriptionDeleted(subscription);
    break;
    case StripeWebhooks.AsyncPaymentSuccess:
      console.log('AsyncPaymentSuccess event ', event.id);
    break;

  }

  res.status(200).json({ received: true });
}

async function onCheckoutCompleted(session: Stripe.Checkout.Session, subscription: Stripe.Subscription) {
  const status: Stripe.Checkout.Session.PaymentStatus = session.payment_status;
  const subscriptionItem = subscription.items.data[0];

  const subscriptionData: UserSubscription = {
    id: session.customer as string,
    status,
    priceId: subscriptionItem.price.id,
    currency: subscriptionItem.price.currency,
    interval: subscriptionItem.price.recurring!.interval,
    intervalCount: subscriptionItem.price.recurring!.interval_count,
    createdAt: subscription.created,
    periodStartsAt: subscription.current_period_start,
    periodEndsAt: subscription.current_period_end,
  }

  // I can assume that the client_reference_id is always set
  const userId = session.client_reference_id!;

  await db.collection('subscriptions').doc(userId).set(subscriptionData, { merge: true });
  await db.collection('users').doc(userId).update({ customerId: session.customer as string });
}

async function onSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  const userId = await db.collection('users').where('customerId', '==', customerId).get().then(snapshot => {
    return snapshot.docs[0].id;
  });
  await db.collection('subscriptions').doc(userId).delete();
  await db.collection('users').doc(userId).update({ customerId: null });
}
