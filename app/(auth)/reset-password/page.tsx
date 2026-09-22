import { ResetPasswordForm } from "@/components/reset-password-form";

export default function ResetPasswordPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-center text-2xl font-bold tracking-tight">
        Set a new password
      </h1>
      <ResetPasswordForm />
    </div>
  );
}
