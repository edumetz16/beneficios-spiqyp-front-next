import { getUserById } from "@/services/users/users";
import { firestore } from "firebase-admin";

export const GET = async (req: Request, { params }: { params: { id: string } }) => {
  try {
    const { id } = params;
    const user = await getUserById(id);
    if (!user) {
      return new Response(JSON.stringify({ error: 'User data not found' }), { status: 404 });
    }

    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error }), { status: 500 });
  }
}