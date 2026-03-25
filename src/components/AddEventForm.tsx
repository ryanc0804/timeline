"use client";

import { useActionState } from "react";
import { createEvent } from "@/app/actions/events";

type State = { error?: string };

const initial: State = {};

export function AddEventForm({
  timelineId,
  defaultColor,
}: {
  timelineId: string;
  defaultColor: string;
}) {
  const [state, formAction, pending] = useActionState(
    async (_prev: State, formData: FormData) => {
      const result = await createEvent(formData);
      return result ?? {};
    },
    initial,
  );

  return (
    <form action={formAction} className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <h3 className="text-base font-medium text-zinc-900 dark:text-zinc-50">
        Add event
      </h3>
      <input type="hidden" name="timelineId" value={timelineId} />
      {state?.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800 dark:bg-red-950/50 dark:text-red-200">
          {state.error}
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label
            htmlFor="ev-title"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Title
          </label>
          <input
            id="ev-title"
            name="title"
            type="text"
            required
            className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
          />
        </div>
        <div>
          <label
            htmlFor="occurredAt"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Date & time
          </label>
          <input
            id="occurredAt"
            name="occurredAt"
            type="datetime-local"
            required
            className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
          />
        </div>
        <div>
          <label
            htmlFor="ev-color"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Color
          </label>
          <input
            id="ev-color"
            name="color"
            type="color"
            defaultValue={defaultColor}
            className="mt-1 h-10 w-full cursor-pointer rounded-lg border border-zinc-300 bg-white p-1 dark:border-zinc-600"
          />
        </div>
        <div className="sm:col-span-2">
          <label
            htmlFor="body"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Notes (optional)
          </label>
          <textarea
            id="body"
            name="body"
            rows={3}
            className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:opacity-60"
      >
        {pending ? "Adding…" : "Add event"}
      </button>
    </form>
  );
}
