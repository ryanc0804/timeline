import Link from "next/link";
import { SignOutButton } from "@/components/SignOutButton";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col bg-zinc-50 dark:bg-zinc-950">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200 bg-white/90 px-6 py-4 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/90">
        <nav className="flex flex-wrap items-center gap-6">
          <Link
            href="/dashboard"
            className="text-lg font-semibold text-indigo-600 dark:text-indigo-400"
          >
            Timeline
          </Link>
          <Link
            href="/"
            className="text-sm text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            Home
          </Link>
        </nav>
        <SignOutButton />
      </header>
      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-10">{children}</main>
    </div>
  );
}
