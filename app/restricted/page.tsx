'use client'

import NextLink from 'next/link';
import { Alert, AlertIcon, Button, Link } from "@chakra-ui/react";

export default function () {
  const billingPortalUrl = process.env.NEXT_PUBLIC_STRIPE_BILLING_PORTAL_URL || '';

  return <div>
    <Alert status='success'>
      <AlertIcon />
      Your subscription is active
    </Alert>

    <br />

    <p>If you want to manage your subscription, head over to the <Link as={NextLink} href={billingPortalUrl}>
      <Button colorScheme="teal" size="lg">
        Billing Portal
      </Button>
    </Link>
    </p>
  </div>;
}