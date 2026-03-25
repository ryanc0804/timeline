import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { deleteTimeline } from "@/app/actions/timelines";
import { AddEventForm } from "@/components/AddEventForm";
import { EventRow, type SerializedEvent } from "@/components/EventRow";
import { TimelineMetaForm } from "@/components/TimelineMetaForm";

export default async function TimelinePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) notFound();

  const timeline = await prisma.timeline.findFirst({
    where: { id, userId },
    include: { events: true },
  });
  if (!timeline) notFound();

  const sorted = [...timeline.events].sort(
    (a, b) => a.occurredAt.getTime() - b.occurredAt.getTime(),
  );

  const serialized: SerializedEvent[] = sorted.map((e) => ({
    id: e.id,
    title: e.title,
    occurredAt: e.occurredAt.toISOString(),
    color: e.color,
    body: e.body,
  }));

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/dashboard"
            className="text-sm text-indigo-600 hover:underline dark:text-indigo-400"
          >
            ← Back to dashboard
          </Link>
          <h1 className="mt-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            {timeline.title}
          </h1>
        </div>
        <form action={deleteTimeline}>
          <input type="hidden" name="id" value={timeline.id} />
          <button
            type="submit"
            className="rounded-lg border border-red-200 px-4 py-2 text-sm text-red-700 transition hover:bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/40"
          >
            Delete timeline
          </button>
        </form>
      </div>

      <TimelineMetaForm
        timeline={{
          id: timeline.id,
          title: timeline.title,
          color: timeline.color,
        }}
      />

      <section>
        <h2 className="mb-6 text-lg font-medium text-zinc-900 dark:text-zinc-50">
          Timeline
        </h2>
        {sorted.length === 0 ? (
          <p className="mb-8 rounded-lg border border-dashed border-zinc-300 px-4 py-8 text-center text-sm text-zinc-500 dark:border-zinc-600">
            No events yet. Add your first entry below.
          </p>
        ) : (
          <div className="relative pl-8">
            <div
              className="absolute bottom-0 left-[11px] top-0 w-px bg-zinc-200 dark:bg-zinc-700"
              aria-hidden
            />
            <ul className="space-y-8">
              {serialized.map((e) => (
                <EventRow key={e.id} event={e} timelineId={timeline.id} />
              ))}
            </ul>
          </div>
        )}
      </section>

      <AddEventForm
        timelineId={timeline.id}
        defaultColor={timeline.color}
      />
    </div>
  );
}
