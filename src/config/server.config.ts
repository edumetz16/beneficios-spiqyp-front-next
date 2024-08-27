export const serverConfig = {
  useSecureCookies: process.env.USE_SECURE_COOKIES === "true",
  firebaseApiKey: JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_CLIENT_CONFIG!)['apiKey'],
  serviceAccount: process.env.FIREBASE_ADMIN_PRIVATE_KEY ? {
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID!,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL!,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY!,
  } : undefined,
};

export const authConfig = {
  apiKey: serverConfig.firebaseApiKey,
  cookieName: "__session",
  cookieSignatureKeys: JSON.parse(process.env.COOKIE_SECRETS || '[""]'),
  cookieSerializeOptions: {
    path: "/",
    httpOnly: true,
    secure: serverConfig.useSecureCookies, // Set this to true on HTTPS environments
    sameSite: "lax" as const,
    maxAge: 12 * 60 * 60 * 24, // twelve days
  },
  serviceAccount: serverConfig.serviceAccount,
};