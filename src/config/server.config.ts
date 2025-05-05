
export const serverConfig = {
  useSecureCookies: process.env.USE_SECURE_COOKIES === 'true',
  firebaseApiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  serviceAccount: process.env.FIREBASE_ADMIN_PRIVATE_KEY
    ? {
        projectId: process.env.NEXT_PUBLIC_PROJECT_ID!,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL!,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(
          /\\n/g,
          '\n'
        )!
      }
    : undefined
};

export const authConfig = {
  apiKey: serverConfig.firebaseApiKey,
  cookieName: '__session',
  cookieSignatureKeys: JSON.parse(process.env.COOKIE_SECRETS || '[""]'),

  cookieSerializeOptions: {
    path: '/',
    httpOnly: true,
    secure: serverConfig.useSecureCookies, // Set this to true on HTTPS environments
    sameSite: 'lax' as const,
    maxAge: 12 * 60 * 60 * 24 // twelve days
  },
  serviceAccount: serverConfig.serviceAccount,
  // Set to false in Firebase Hosting environment due to https://stackoverflow.com/questions/44929653/firebase-cloud-function-wont-store-cookie-named-other-than-session
  enableMultipleCookies: false,
  // Set to false if you're not planning to use `signInWithCustomToken` Firebase Client SDK method
  enableCustomToken: false,
  experimental_enableTokenRefreshOnExpiredKidHeader: true,
  debug: true,
};
