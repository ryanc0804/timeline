"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const hexColor = z
  .string()
  .regex(/^#[0-9A-Fa-f]{6}$/, "Use a valid hex color");

async function requireUserId() {
  const session = await auth();
  const id = session?.user?.id;
  if (!id) throw new Error("Unauthorized");
  return id;
}

async function assertTimelineOwner(timelineId: string, userId: string) {
  const t = await prisma.timeline.findFirst({
    where: { id: timelineId, userId },
  });
  return t;
}

const createSchema = z.object({
  timelineId: z.string().min(1),
  title: z.string().min(1).max(200),
  occurredAt: z.coerce.date(),
  color: hexColor,
  body: z.string().max(5000).optional(),
});

export async function createEvent(formData: FormData) {
  const userId = await requireUserId();
  const colorRaw = String(formData.get("color") ?? "#22c55e").trim();
  const colorParsed = hexColor.safeParse(colorRaw);
  const color = colorParsed.success ? colorParsed.data : "#22c55e";
  const parsed = createSchema.safeParse({
    timelineId: formData.get("timelineId"),
    title: formData.get("title"),
    occurredAt: formData.get("occurredAt"),
    color,
    body: formData.get("body") || undefined,
  });
  if (!parsed.success) {
    return { error: "Check all fields: title and date/time are required." };
  }
  const { timelineId, title, occurredAt, body } = parsed.data;
  const timeline = await assertTimelineOwner(timelineId, userId);
  if (!timeline) return { error: "Timeline not found." };
  await prisma.timelineEvent.create({
    data: {
      timelineId,
      title,
      occurredAt,
      color: parsed.data.color,
      body: body || null,
    },
  });
  revalidatePath(`/timeline/${timelineId}`);
  return { ok: true as const };
}

const updateSchema = z.object({
  id: z.string().min(1),
  timelineId: z.string().min(1),
  title: z.string().min(1).max(200),
  occurredAt: z.coerce.date(),
  color: hexColor,
  body: z.string().max(5000).optional(),
});

export async function updateEvent(data: z.infer<typeof updateSchema>) {
  const userId = await requireUserId();
  const parsed = updateSchema.safeParse(data);
  if (!parsed.success) {
    return { error: "Invalid event data." };
  }
  const { id, timelineId, title, occurredAt, color, body } = parsed.data;
  const timeline = await assertTimelineOwner(timelineId, userId);
  if (!timeline) return { error: "Timeline not found." };
  const ev = await prisma.timelineEvent.findFirst({
    where: { id, timelineId },
  });
  if (!ev) return { error: "Event not found." };
  await prisma.timelineEvent.update({
    where: { id },
    data: { title, occurredAt, color, body: body ?? null },
  });
  revalidatePath(`/timeline/${timelineId}`);
  return { ok: true as const };
}

export async function deleteEvent(formData: FormData) {
  const userId = await requireUserId();
  const id = String(formData.get("id") ?? "");
  const timelineId = String(formData.get("timelineId") ?? "");
  if (!id || !timelineId) return { error: "Missing fields." };
  const timeline = await assertTimelineOwner(timelineId, userId);
  if (!timeline) return { error: "Timeline not found." };
  const ev = await prisma.timelineEvent.findFirst({
    where: { id, timelineId },
  });
  if (!ev) return { error: "Event not found." };
  await prisma.timelineEvent.delete({ where: { id } });
  revalidatePath(`/timeline/${timelineId}`);
  return { ok: true as const };
}
