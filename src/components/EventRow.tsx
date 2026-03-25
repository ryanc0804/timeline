"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteEvent, updateEvent } from "@/app/actions/events";
import { toDatetimeLocalValue } from "@/lib/datetime";

export type SerializedEvent = {
  id: string;
  title: string;
  occurredAt: string;
  color: string;
  body: string | null;
};

export function EventRow({
  event,
  timelineId,
}: {
  event: SerializedEvent;
  timelineId: string;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setUpdateError(null);
    startTransition(async () => {
      const title = String(formData.get("title") ?? "").trim();
      const occurredAt = String(formData.get("occurredAt") ?? "");
      const color = String(formData.get("color") ?? "#22c55e").trim();
      const bodyRaw = formData.get("body");
      const body =
        typeof bodyRaw === "string" && bodyRaw.trim() ? bodyRaw.trim() : undefined;
      const result = await updateEvent({
        id: event.id,
        timelineId,
        title,
        occurredAt: new Date(occurredAt),
        color,
        body,
      });
      if ("error" in result && result.error) {
        setUpdateError(result.error);
        return;
      }
      setEditing(false);
      router.refresh();
    });
  }

  function handleDelete() {
    setDeleteError(null);
    startTransition(async () => {
      const fd = new FormData();
      fd.set("id", event.id);
      fd.set("timelineId", timelineId);
      const result = await deleteEvent(fd);
      if ("error" in result && result.error) {
        setDeleteError(result.error);
        return;
      }
      router.refresh();
    });
  }

  if (editing) {
    return (
      <li className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <form onSubmit={handleUpdate} className="space-y-3">
          {updateError && (
            <p className="text-sm text-red-600 dark:text-red-400">{updateError}</p>
          )}
          <div>
            <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400">
              Title
            </label>
            <input
              name="title"
              type="text"
              required
              defaultValue={event.title}
              className="mt-0.5 w-full rounded-lg border border-zinc-300 bg-white px-2 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400">
              Date & time
            </label>
            <input
              name="occurredAt"
              type="datetime-local"
              required
              defaultValue={toDatetimeLocalValue(event.occurredAt)}
              className="mt-0.5 w-full rounded-lg border border-zinc-300 bg-white px-2 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
            />
          </div>
          <div className="flex items-center gap-3">
            <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
              Color
            </label>
            <input
              name="color"
              type="color"
              defaultValue={event.color}
              className="h-8 w-14 cursor-pointer rounded border border-zinc-300 p-0.5 dark:border-zinc-600"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400">
              Notes
            </label>
            <textarea
              name="body"
              rows={2}
              defaultValue={event.body ?? ""}
              className="mt-0.5 w-full rounded-lg border border-zinc-300 bg-white px-2 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              disabled={isPending}
              className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm text-white hover:bg-indigo-500 disabled:opacity-60"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li className="relative">
      <div
        className="absolute left-0 top-3 h-3 w-3 rounded-full border-2 border-white shadow ring-1 ring-zinc-200 dark:border-zinc-900 dark:ring-zinc-600"
        style={{ backgroundColor: event.color }}
      />
      <div className="ml-6 flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:flex-row sm:items-start sm:justify-between dark:border-zinc-800 dark:bg-zinc-900">
        <div className="min-w-0 flex-1">
          <p className="font-medium text-zinc-900 dark:text-zinc-50">
            {event.title}
          </p>
          <p className="text-sm text-zinc-500">
            {new Date(event.occurredAt).toLocaleString(undefined, {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
          {event.body && (
            <p className="mt-2 whitespace-pre-wrap text-sm text-zinc-700 dark:text-zinc-300">
              {event.body}
            </p>
          )}
          {deleteError && (
            <p className="mt-2 text-sm text-red-600">{deleteError}</p>
          )}
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-600"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isPending}
            className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-700 hover:bg-red-50 disabled:opacity-60 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/40"
          >
            {isPending ? "…" : "Delete"}
          </button>
        </div>
      </div>
    </li>
  );
}
