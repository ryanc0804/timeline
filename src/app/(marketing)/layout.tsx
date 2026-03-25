import Link from "next/link";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-col bg-zinc-50 dark:bg-zinc-950">
      <header className="border-b border-zinc-200 bg-white/90 px-6 py-4 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/90">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-indigo-600 dark:text-indigo-400"
        >
          Timeline
        </Link>
      </header>
      {children}
    </div>
  );
}
