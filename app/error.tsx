"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="max-w-md space-y-4 rounded-md border border-red-300 bg-red-50 p-6">
      <h2 className="text-lg font-semibold text-red-800">Something went wrong</h2>
      <p className="text-sm text-red-700">
        {error.message || "Failed to load. Please try again."}
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="rounded-md bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-800"
      >
        Retry
      </button>
    </div>
  );
}
