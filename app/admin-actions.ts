"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin";
import { adminDeleteContentPiece } from "@/lib/data/admin";

export async function adminDeletePieceAction(
  id: string,
  _formData: FormData,
): Promise<void> {
  const user = await getCurrentUser();
  if (!isAdminEmail(user?.email)) {
    throw new Error("Forbidden.");
  }
  await adminDeleteContentPiece(id);
  revalidatePath("/admin");
}
