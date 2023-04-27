
export type UserSubscription = {
  id: string; // user id
  status: 'unpaid' | 'active' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'past_due' | 'paused' | 'trialing';
  priceId: string;
  currency: string;
  interval: 'day' | 'month' | 'week' | 'year';
  intervalCount: number;
  createdAt: number;
  periodStartsAt: number;
  periodEndsAt: number;
}