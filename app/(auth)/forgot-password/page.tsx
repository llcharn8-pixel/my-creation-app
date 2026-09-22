import Link from "next/link";
import { ForgotPasswordForm } from "@/components/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-center text-2xl font-bold tracking-tight">
          Reset your password
        </h1>
        <p className="mt-2 text-center text-sm text-neutral-500">
          Enter your email and we&apos;ll send you a link to set a new
          password.
        </p>
      </div>
      <ForgotPasswordForm />
      <p className="text-center text-sm text-neutral-500">
        <Link href="/login" className="text-neutral-900 hover:underline">
          Back to log in
        </Link>
      </p>
    </div>
  );
}
