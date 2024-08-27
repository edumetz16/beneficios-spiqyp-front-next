import { redirect } from "next/navigation";

import PageContent from "../components/PageContent";
import { getCurrentUser } from "@/services/auth/auth.service";

export default async function DashboardPage() {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/sign-in");

  return (
    <main className="container">
      <PageContent variant="dashboard" currentUser={currentUser.toJSON() as typeof currentUser} />
    </main>
  );
}