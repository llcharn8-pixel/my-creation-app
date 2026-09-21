import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-md space-y-4 rounded-md border border-dashed border-neutral-300 p-8 text-center">
      <h2 className="text-lg font-semibold">Piece not found</h2>
      <p className="text-sm text-neutral-500">
        It may have been deleted, or the link is out of date.
      </p>
      <Link
        href="/"
        className="inline-block rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
      >
        Back to library
      </Link>
    </div>
  );
}
