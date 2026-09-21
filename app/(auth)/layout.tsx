export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center text-lg font-bold tracking-tight">
          Content Studio
        </div>
        {children}
      </div>
    </div>
  );
}
