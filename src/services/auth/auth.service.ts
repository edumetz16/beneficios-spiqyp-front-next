import "server-only";

import { cookies } from "next/headers";

import { initializeApp, getApps, cert } from "firebase-admin/app";
import { SessionCookieOptions, getAuth } from "firebase-admin/auth";
import { firebaseApp } from "../firebase/firebase";
import sheetsDatabase from "../firestore/sheetsDatabase";
import { CreateUserRequestAdditionalValidation } from "@/app/api/auth/[action]/route";
import { NextRequest } from "next/server";


export const auth = getAuth(firebaseApp);

export async function isUserAuthenticated(session: string | undefined = undefined) {
  const _session = session ?? (await getSession());
  if (!_session) return false;

  try {
    const isRevoked = !(await auth.verifySessionCookie(_session, true));
    return !isRevoked;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function getCurrentUser() {
  const session = await getSession();

  if (!(await isUserAuthenticated(session))) {
    return null;
  }

  const decodedIdToken = await auth.verifySessionCookie(session!);
  const currentUser = await auth.getUser(decodedIdToken.uid);

  return currentUser;
}

async function getSession() {
  try {
    return cookies().get("__session")?.value;
  } catch (error) {
    return undefined;
  }
}

export async function createSessionCookie(idToken: string, sessionCookieOptions: SessionCookieOptions) {
  return auth.createSessionCookie(idToken, sessionCookieOptions);
}

export async function revokeAllSessions(session: string) {
  const decodedIdToken = await auth.verifySessionCookie(session);

  return await auth.revokeRefreshTokens(decodedIdToken.sub);
}

export async function verifyIdToken(idToken: string) {
  const session = await getSession();

  if (!(await isUserAuthenticated(session))) {
    throw new Error("User not authenticated");
  }
  const decodedIdToken = await auth.verifySessionCookie(session!);
  const currentUser = await auth.getUser(decodedIdToken.uid);
}

export const createUserWithValidation = async ({email, password, affiliateNumber, document}: CreateUserRequestAdditionalValidation) => {
  const dbService = new sheetsDatabase();
  const isValid = await dbService.isValidAfiiliate(affiliateNumber, document);
  if(!isValid) throw new Error("Invalid affiliate", {cause: {code: "auth/invalid-affiliate"}});
  const user = await auth.createUser({password, email});
  await auth.updateUser(user.uid, {emailVerified: true});
  return user;
}