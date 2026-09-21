import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin";
import { NavShell } from "@/components/nav-shell";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <NavShell userEmail={user.email ?? null} isAdmin={isAdminEmail(user.email)}>
      {children}
    </NavShell>
  );
}
