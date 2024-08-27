import { GoogleAuthProvider, UserCredential, createUserWithEmailAndPassword, getAuth, sendEmailVerification, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";

import { getApps, initializeApp } from "firebase/app";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import { use } from "react";
import { getToken } from "firebase/app-check";
import { getAppCheck } from "../app-check/app-check.service";
import { NextApiResponse } from "next";

let firebaseConfig;

const app = getApps().find((it) => it.name === "firebase-client-app") ||
  initializeApp(
    {
      apiKey: "AIzaSyBvIzOhe_imZAQtXWq3UVolFp8QoCjXXvA",
      authDomain: "web-spiqyp.firebaseapp.com",
      projectId: "web-spiqyp",
      storageBucket: "web-spiqyp.appspot.com",
      messagingSenderId: "849474439575",
      appId: "1:849474439575:web:1711e28672ca9395359cd2",
      measurementId: "G-NXP3G5RXY8"
    },
    "firebase-client-app"
  );
const auth = getAuth(app);
const db = getFirestore(app)

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();

  try {
    const userCreds = await signInWithPopup(auth, provider);
    // await createUser(userCreds)
    const idToken = await userCreds.user.getIdToken();
    return createSession(idToken);
  } catch (error) {
    console.error("Error signing in with Google", error);
    return false;
  }
}

export async function signOut() {
  await auth.signOut();
  const headers: Record<string, string> = {};

  // This is optional. Use it if your app supports App Check – https://firebase.google.com/docs/app-check
  if (process.env.NEXT_PUBLIC_FIREBASE_APP_CHECK_KEY) {
    const appCheckTokenResponse = await getToken(getAppCheck(), false);

    headers['X-Firebase-AppCheck'] = appCheckTokenResponse.token;
  }

  await fetch('/api/logout', {
    method: 'GET',
    headers
  })
}

export async function signUpWithEmail(data: any) {
  const userResponse = await fetch("/api/auth/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const userResponseBody = await userResponse.json();
  if (userResponse.ok) {
  
    return true;
  } else {
    throw userResponseBody.error;
  }
  
}

export async function signInWithEmail(email:string,password:string){
    
const userCreds = await signInWithEmailAndPassword(auth, email, password)

  if (!userCreds.user.emailVerified){
    throw "auth/email-not-verified";
  }else{
    const idToken = await userCreds.user.getIdToken();
    return await createSession(idToken);
  }
  
}

async function createSession(idToken:string){
  const headers: Record<string, string> = {
    Authorization: `Bearer ${idToken}`
  };

  // This is optional. Use it if your app supports App Check – https://firebase.google.com/docs/app-check
  if (process.env.NEXT_PUBLIC_FIREBASE_APP_CHECK_KEY) {
    const appCheckTokenResponse = await getToken(getAppCheck(), false);

    headers['X-Firebase-AppCheck'] = appCheckTokenResponse.token;
  }

  await fetch('/api/login', {
    method: 'GET',
    headers
  });
}

export async function login(token: string) {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`
  };

  // This is optional. Use it if your app supports App Check – https://firebase.google.com/docs/app-check
  if (process.env.NEXT_PUBLIC_FIREBASE_APP_CHECK_KEY) {
    const appCheckTokenResponse = await getToken(getAppCheck(), false);

    headers['X-Firebase-AppCheck'] = appCheckTokenResponse.token;
  }

  await fetch('/api/login', {
    method: 'GET',
    headers
  });
}

export async function loginWithCredential(credential: UserCredential) {
  const idToken = await credential.user.getIdToken();

  await login(idToken);
}

export async function logout() {
  const headers: Record<string, string> = {};

  // This is optional. Use it if your app supports App Check – https://firebase.google.com/docs/app-check
  if (process.env.NEXT_PUBLIC_FIREBASE_APP_CHECK_KEY) {
    const appCheckTokenResponse = await getToken(getAppCheck(), false);

    headers['X-Firebase-AppCheck'] = appCheckTokenResponse.token;
  }

  await fetch('/api/logout', {
    method: 'GET',
    headers
  });
}

export async function refreshToken() {
  const headers: Record<string, string> = {};

  // This is optional. Use it if your app supports App Check – https://firebase.google.com/docs/app-check
  if (process.env.NEXT_PUBLIC_FIREBASE_APP_CHECK_KEY) {
    const appCheckTokenResponse = await getToken(getAppCheck(), false);

    headers['X-Firebase-AppCheck'] = appCheckTokenResponse.token;
  }

  await fetch('/api/refresh-token', {
    method: 'GET',
    headers
  });
}