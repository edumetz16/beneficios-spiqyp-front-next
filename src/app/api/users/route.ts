import { createUserWithValidation } from "@/services/auth/auth.service";
import { createUser } from "@/services/users/users";

export const POST = async (request: Request) => {
  try {
    const data = await request.json();
    const authUser = await createUserWithValidation({
      email: data.email,
      password: data.password,
      document: data.document,
      affiliateNumber: data.affiliateNumber,
    })
    if (!authUser) {
      return new Response(JSON.stringify({ success: false, error: "auth/user-creation-error" }), { status: 400 });
    }
    const dbUser = await createUser(data, authUser.uid);
    return new Response(JSON.stringify({ success: true, data: authUser }), { status: 200 });
  } catch (error) {
    
  }
}