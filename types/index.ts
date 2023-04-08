
export type UserSubscription = {
  id: string; // user id
  status: 'no_payment_required' | 'paid' | 'unpaid';
  priceId: string;
  currency: string;
  interval: 'day' | 'month' | 'week' | 'year';
  intervalCount: number;
  createdAt: number;
  periodStartsAt: number;
  periodEndsAt: number;
}