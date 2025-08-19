import { db } from "@/services/firestore/firestore";
import { adminAuth } from "@/services/firebase/firebase";

export const POST = async (request: Request) => {
  try {
    const data = await request.json();
    const govId = data.govId;
    if (!govId) {
      return new Response(JSON.stringify({ success: false, error: "govId is required" }), { status: 400 });
    }
    // Find user in Firestore by govId
    const userSnap = await db.collection("users").where("govId", "==", govId).get();
    if (userSnap.empty) {
      return new Response(JSON.stringify({ success: false, error: "User not found. Please contact support." }), { status: 404 });
    }
    const userDoc = userSnap.docs[0];
    const userId = userDoc.id;
    // Update Firestore user with email and hasAccount
    await db.collection("users").doc(userId).update({
      email: data.email,
      hasAccount: true,
    });
    // Create Auth user with Firestore doc ID as UID
    const authUser = await adminAuth.createUser({
      uid: userId,
      email: data.email,
      password: data.password,
    });
    return new Response(JSON.stringify({ success: true, data: authUser }), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ success: false, error: "auth/user-creation-error" }), { status: 400 });
  }
}