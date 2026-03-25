import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { CreateTimelineForm } from "@/components/CreateTimelineForm";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return null;

  const timelines = await prisma.timeline.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Your timelines
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Signed in as {session.user?.email ?? session.user?.name ?? "user"}
        </p>
      </div>

      <CreateTimelineForm />

      {timelines.length === 0 ? (
        <p className="rounded-xl border border-dashed border-zinc-300 px-6 py-12 text-center text-zinc-600 dark:border-zinc-600 dark:text-zinc-400">
          No timelines yet. Create one above to get started.
        </p>
      ) : (
        <ul className="space-y-3">
          {timelines.map((t) => (
            <li key={t.id}>
              <Link
                href={`/timeline/${t.id}`}
                className="flex items-center gap-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:border-indigo-300 hover:bg-indigo-50/50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-indigo-700 dark:hover:bg-indigo-950/30"
              >
                <span
                  className="h-10 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: t.color }}
                />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-zinc-900 dark:text-zinc-50">
                    {t.title}
                  </p>
                  <p className="text-xs text-zinc-500">
                    Updated {t.updatedAt.toLocaleDateString()}
                  </p>
                </div>
                <span className="text-sm text-indigo-600 dark:text-indigo-400">
                  Open →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
