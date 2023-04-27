import getRawBody from 'raw-body';
import { db } from '../../firebase-admin';
import { UserSubscription } from '../../types';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2022-11-15' });

export enum StripeWebhooks {
  Completed = 'checkout.session.completed',
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

/**
 * We'll be listening to only two webhooks:
 * - checkout.session.completed
 * - customer.subscription.updated
 * 
 * Checkout session completed is fired when the user completes the checkout process, and we needed to reconcile the stripe session
 * with our internal user subscription data, by using the client_reference_id
 * 
 * Customer subscription updated is fired when the subscription status changes, and we need to update our internal subscription status
 * 
 * The order of the events are not guaranteed, so we need to handle the case where the subscription is updated before the checkout session is completed.
 * In this case we create the subscription but we lack the client_reference_id, so we need to update that later.
 * 
 * @param req 
 * @param res 
 */
export default async function (req, res) {

  const signature = req.headers[STRIPE_SIGNATURE_HEADER];
  const rawBody = await getRawBody(req);
  const event = stripe.webhooks.constructEvent(
    rawBody,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!
  );

  let session, subscriptionId, subscription;
  switch (event.type) {
    case StripeWebhooks.Completed:
      session = event.data.object as Stripe.Checkout.Session;
      subscriptionId = session.subscription as string;
      subscription = await stripe.subscriptions.retrieve(subscriptionId);

      await setSubscriptionInFirestore(subscription);
      // I can assume that the client_reference_id is always set
      const userId = session.client_reference_id!;
      await db.collection('users').doc(userId).update({ customerId: session.customer as string });
      break;
    case StripeWebhooks.SubscriptionUpdated:
      subscription = event.data.object as Stripe.Subscription;
      subscriptionId = subscription.id as string;
      // I want to pull the subscription again to make sure I get the latest data
      subscription = await stripe.subscriptions.retrieve(subscriptionId);

      await setSubscriptionInFirestore(subscription);
      break;
    case StripeWebhooks.SubscriptionDeleted:
      subscription = event.data.object as Stripe.Subscription;
      await onSubscriptionDeleted(subscription);
      break;
  }

  res.status(200).json({ received: true });
}

// Creates or updates the subscription in our firestore db
async function setSubscriptionInFirestore(subscription: Stripe.Subscription) {
  const subscriptionItem = subscription.items.data[0];

  const subscriptionData: UserSubscription = {
    id: subscription.id,
    status: subscription.status,
    priceId: subscriptionItem.price.id,
    currency: subscriptionItem.price.currency,
    interval: subscriptionItem.price.recurring!.interval,
    intervalCount: subscriptionItem.price.recurring!.interval_count,
    createdAt: subscription.created,
    periodStartsAt: subscription.current_period_start,
    periodEndsAt: subscription.current_period_end,
  }

  await db.collection('subscriptions').doc(subscription.customer as string).set(subscriptionData, { merge: true });
}

async function onSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  const userId = await db.collection('users').where('customerId', '==', customerId).get().then(snapshot => {
    return snapshot.docs[0].id;
  });
  await db.collection('subscriptions').doc(customerId).delete();
  await db.collection('users').doc(userId).update({ customerId: null });
}
