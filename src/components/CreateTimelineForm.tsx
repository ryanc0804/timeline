"use client";

import { useActionState } from "react";
import { createTimeline } from "@/app/actions/timelines";

type State = { error?: string };

const initial: State = {};

export function CreateTimelineForm() {
  const [state, formAction, pending] = useActionState(
    async (_prev: State, formData: FormData) => {
      const result = await createTimeline(formData);
      return result ?? {};
    },
    initial,
  );

  return (
    <form action={formAction} className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">
        New timeline
      </h2>
      {state?.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800 dark:bg-red-950/50 dark:text-red-200">
          {state.error}
        </p>
      )}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="min-w-0 flex-1">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            placeholder="e.g. Product launch"
            className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
          />
        </div>
        <div>
          <label
            htmlFor="color"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Accent color
          </label>
          <input
            id="color"
            name="color"
            type="color"
            defaultValue="#6366f1"
            className="mt-1 h-10 w-full min-w-[5rem] cursor-pointer rounded-lg border border-zinc-300 bg-white p-1 dark:border-zinc-600"
          />
        </div>
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:opacity-60"
        >
          {pending ? "Creating…" : "Create"}
        </button>
      </div>
    </form>
  );
}
