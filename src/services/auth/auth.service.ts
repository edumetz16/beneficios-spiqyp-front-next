import "server-only";

import { cookies } from "next/headers";

import { initializeApp, getApps, cert } from "firebase-admin/app";
import { SessionCookieOptions, getAuth } from "firebase-admin/auth";
import { adminAuth, firebaseApp } from "../firebase/firebase";
import sheetsDatabase from "../firestore/sheetsDatabase";
import { CreateUserRequestAdditionalValidation } from "@/app/api/auth/[action]/route";
import { NextRequest } from "next/server";



export async function isUserAuthenticated(session: string | undefined = undefined) {
  const _session = session ?? (await getSession());
  if (!_session) return false;

  try {
    const isRevoked = !(await adminAuth.verifySessionCookie(_session, true));
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

  const decodedIdToken = await adminAuth.verifySessionCookie(session!);
  const currentUser = await adminAuth.getUser(decodedIdToken.uid);

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
  return adminAuth.createSessionCookie(idToken, sessionCookieOptions);
}

export async function revokeAllSessions(session: string) {
  const decodedIdToken = await adminAuth.verifySessionCookie(session);

  return await adminAuth.revokeRefreshTokens(decodedIdToken.sub);
}

export async function verifyIdToken(idToken: string) {
  const session = await getSession();

  if (!(await isUserAuthenticated(session))) {
    throw new Error("User not authenticated");
  }
  const decodedIdToken = await adminAuth.verifySessionCookie(session!);
  const currentUser = await adminAuth.getUser(decodedIdToken.uid);
}

export const createAuthUserWithValidation = async ({email, password, affiliateNumber, govId}: CreateUserRequestAdditionalValidation) => {
  const dbService = new sheetsDatabase();
  const isValid = await dbService.isValidAfiiliate(affiliateNumber, govId);
  if(!isValid) throw new Error("Invalid affiliate", {cause: {code: "auth/invalid-affiliate"}});
  const user = await adminAuth.createUser({password, email});
  return user;
}