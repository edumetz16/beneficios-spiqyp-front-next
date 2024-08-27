import {NextRequest, NextResponse} from 'next/server';
import {
  authMiddleware,
  getFirebaseAuth,
  redirectToHome,
  redirectToLogin
} from 'next-firebase-auth-edge';

const serviceAccount = {
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID || "",
  privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY || "",
  clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL || ""
};

const {
  getUser,
} = getFirebaseAuth({
  apiKey: 'YOUR FIREBASE API KEY',
  serviceAccount
});

const PUBLIC_PATHS = ['/','/login','/register','/reset-password'];
const LOGIN_PATHS = ['/login','/register'];

export async function middleware(request: NextRequest) {
  return authMiddleware(request, {
    loginPath: '/api/login',
    logoutPath: '/api/logout',
    apiKey: "AIzaSyBvIzOhe_imZAQtXWq3UVolFp8QoCjXXvA",
    cookieName: "__session",
    cookieSerializeOptions: {
      path: "/",
      httpOnly: true,
      secure: true, // Set this to true on HTTPS environments
      sameSite: "lax" as const,
      maxAge: 12 * 60 * 60 * 24, // twelve days
    },
    cookieSignatureKeys: JSON.parse(process.env.COOKIE_SECRETS || '[]'),
    serviceAccount,
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
    // handleInvalidToken: async (reason) => {

    //   return redirectToLogin(request, {
    //     path: '/login',
    //     publicPaths: PUBLIC_PATHS
    //   });
    // },
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