# nextjs-stripe-firebase

[Edit on StackBlitz ⚡️](https://stackblitz.com/edit/nextjs-stripe)

# NextJS Authentication: Google

[NextAuth documentation on Google's provider](https://next-auth.js.org/providers/google)

This integration makes use of Next Auth package, the Google Authentication Provider and also Firestore (Firebase).

- In [Google's developer console](https://console.developers.google.com/) create a new project

- Obtain OAuth 2.0 credentials from [Google's developer console](https://console.developers.google.com/) (You may need to create a new application)

- Configure Oauth 2.0 Client urls in console

- Update pages/api/auth/[...nextauth].js to use Google as provider

- Add nextauth env variables (URL and SECRET)

# Stripe Integration: Billing

