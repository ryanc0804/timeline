"use client";

import { useActionState } from "react";
import { updateTimelineFromForm } from "@/app/actions/timelines";

type State = { error?: string; ok?: boolean };

const initial: State = {};

export function TimelineMetaForm({
  timeline,
}: {
  timeline: { id: string; title: string; color: string };
}) {
  const [state, formAction, pending] = useActionState(
    async (_prev: State, formData: FormData) => {
      return updateTimelineFromForm(formData);
    },
    initial,
  );

  return (
    <form
      action={formAction}
      className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
    >
      <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">
        Timeline settings
      </h2>
      <input type="hidden" name="id" value={timeline.id} />
      {state?.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800 dark:bg-red-950/50 dark:text-red-200">
          {state.error}
        </p>
      )}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="min-w-0 flex-1">
          <label
            htmlFor="tl-title"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Title
          </label>
          <input
            id="tl-title"
            name="title"
            type="text"
            required
            defaultValue={timeline.title}
            className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
          />
        </div>
        <div>
          <label
            htmlFor="tl-color"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Accent color
          </label>
          <input
            id="tl-color"
            name="color"
            type="color"
            defaultValue={timeline.color}
            className="mt-1 h-10 w-full min-w-[5rem] cursor-pointer rounded-lg border border-zinc-300 bg-white p-1 dark:border-zinc-600"
          />
        </div>
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
        >
          {pending ? "Saving…" : "Save"}
        </button>
      </div>
    </form>
  );
}
