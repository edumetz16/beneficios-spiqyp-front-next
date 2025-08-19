import {NextRequest, NextResponse} from 'next/server';
import {
  authMiddleware,
  getFirebaseAuth,
  redirectToHome,
  redirectToLogin
} from 'next-firebase-auth-edge';
import { authConfig } from "./config/server.config";

const serviceAccount = {
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID || "",
  privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY || "",
  clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL || ""
};

const {
  getUser,
} = getFirebaseAuth({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  serviceAccount
});

const PUBLIC_PATHS = ['/login','/register','/reset-password','/reset-password/confirm'];
const LOGIN_PATHS = ['/login','/register'];

export async function middleware(request: NextRequest) {
  return authMiddleware(request, {
    loginPath: '/api/login',
    logoutPath: '/api/logout',
    debug: authConfig.debug,
    enableMultipleCookies: authConfig.enableMultipleCookies,
    apiKey: authConfig.apiKey,
    cookieName: authConfig.cookieName,
    cookieSerializeOptions: authConfig.cookieSerializeOptions,
    cookieSignatureKeys: authConfig.cookieSignatureKeys,
    serviceAccount: authConfig.serviceAccount,
    handleValidToken: async ({token, decodedToken}, headers) => {
      // Authenticated user should not be able to access /login, /register and /reset-password routes
      if (LOGIN_PATHS.includes(request.nextUrl.pathname)) {
        return redirectToHome(request);
      }

      return NextResponse.next({
        request: {
          headers
        }
      });
    },
    handleInvalidToken: async (reason) => {
      return redirectToLogin(request, {
        path: '/login',
        publicPaths: PUBLIC_PATHS
      });
    },
    // handleError: async (error) => {

    //   return redirectToLogin(request, {
    //     path: '/login',
    //     publicPaths: PUBLIC_PATHS
    //   });
    // }
  });
}

export const config = {
  matcher: [
    '/',
    '/((?!_next|favicon.ico|__/auth|__/firebase|api|.*\\.).*)',
    '/api/login',
    '/api/logout'
  ]
};