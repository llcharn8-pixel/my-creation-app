"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin";
import {
  adminDeleteContentPiece,
  adminClaimContentPiece,
} from "@/lib/data/admin";

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

export async function adminClaimPieceAction(
  id: string,
  _formData: FormData,
): Promise<void> {
  const user = await getCurrentUser();
  if (!user || !isAdminEmail(user.email)) {
    throw new Error("Forbidden.");
  }
  await adminClaimContentPiece(id, user.id);
  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/topics");
}
