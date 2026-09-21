import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin";
import { getAllContentPiecesForAdmin } from "@/lib/data/admin";
import { AdminTable } from "@/components/admin-table";

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!isAdminEmail(user?.email)) notFound();

  const pieces = await getAllContentPiecesForAdmin();
  const unowned = pieces.filter((p) => !p.user_id).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin</h1>
        <p className="text-sm text-neutral-500">
          Every content piece across every user ({pieces.length} total
          {unowned > 0 ? `, ${unowned} unowned legacy` : ""}). Regular users
          never see this — it bypasses row-level security via the
          service-role key.
        </p>
      </div>

      <AdminTable pieces={pieces} />
    </div>
  );
}
