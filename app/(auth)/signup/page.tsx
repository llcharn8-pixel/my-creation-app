import Link from "next/link";
import { SignupForm } from "@/components/signup-form";

export default function SignupPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-center text-2xl font-bold tracking-tight">Sign up</h1>
      <SignupForm />
      <p className="text-center text-sm text-neutral-500">
        Already have an account?{" "}
        <Link href="/login" className="text-neutral-900 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
