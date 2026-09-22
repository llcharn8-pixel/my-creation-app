import Link from "next/link";
import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-center text-2xl font-bold tracking-tight">Log in</h1>
      <LoginForm />
      <div className="flex items-center justify-between text-sm text-neutral-500">
        <Link href="/forgot-password" className="hover:underline">
          Forgot password?
        </Link>
        <span>
          No account?{" "}
          <Link href="/signup" className="text-neutral-900 hover:underline">
            Sign up
          </Link>
        </span>
      </div>
    </div>
  );
}
