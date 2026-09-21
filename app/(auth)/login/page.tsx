import Link from "next/link";
import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-center text-2xl font-bold tracking-tight">Log in</h1>
      <LoginForm />
      <p className="text-center text-sm text-neutral-500">
        No account?{" "}
        <Link href="/signup" className="text-neutral-900 hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
