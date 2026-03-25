"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
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

export async function createTimeline(formData: FormData) {
  const userId = await requireUserId();
  const title = String(formData.get("title") ?? "").trim();
  const colorRaw = String(formData.get("color") ?? "#6366f1").trim();
  const colorParsed = hexColor.safeParse(colorRaw);
  const color = colorParsed.success ? colorParsed.data : "#6366f1";
  if (!title) {
    return { error: "Title is required." };
  }
  const timeline = await prisma.timeline.create({
    data: { userId, title, color },
  });
  revalidatePath("/dashboard");
  redirect(`/timeline/${timeline.id}`);
}

const updateTimelineSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(200),
  color: hexColor,
});

export async function updateTimelineFromForm(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const color = String(formData.get("color") ?? "").trim();
  return updateTimeline({ id, title, color });
}

export async function updateTimeline(data: z.infer<typeof updateTimelineSchema>) {
  const userId = await requireUserId();
  const parsed = updateTimelineSchema.safeParse(data);
  if (!parsed.success) {
    return { error: "Invalid timeline data." };
  }
  const { id, title, color } = parsed.data;
  const existing = await prisma.timeline.findFirst({
    where: { id, userId },
  });
  if (!existing) return { error: "Timeline not found." };
  await prisma.timeline.update({
    where: { id },
    data: { title, color },
  });
  revalidatePath("/dashboard");
  revalidatePath(`/timeline/${id}`);
  return { ok: true as const };
}

export async function deleteTimeline(formData: FormData): Promise<void> {
  const userId = await requireUserId();
  const id = String(formData.get("id") ?? "");
  if (!id) redirect("/dashboard");
  const existing = await prisma.timeline.findFirst({
    where: { id, userId },
  });
  if (!existing) redirect("/dashboard");
  await prisma.timeline.delete({ where: { id } });
  revalidatePath("/dashboard");
  redirect("/dashboard");
}
