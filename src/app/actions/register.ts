"use server";

import bcrypt from "bcryptjs";
import { z } from "zod";
import { signIn } from "@/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().min(1, "Name is required").max(120),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters").max(200),
});

export type RegisterState = { error?: string };

export async function register(
  _prev: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  const parsed = schema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    const first = parsed.error.flatten().fieldErrors;
    const msg =
      first.name?.[0] ?? first.email?.[0] ?? first.password?.[0] ?? "Invalid input";
    return { error: msg };
  }
  const { name, email, password } = parsed.data;
  const emailNorm = email.trim().toLowerCase();
  try {
    await prisma.user.create({
      data: {
        name,
        email: emailNorm,
        passwordHash: await bcrypt.hash(password, 12),
      },
    });
  } catch (e: unknown) {
    if (
      typeof e === "object" &&
      e !== null &&
      "code" in e &&
      (e as { code: string }).code === "P2002"
    ) {
      return { error: "An account with this email already exists." };
    }
    throw e;
  }
  await signIn("credentials", {
    email: emailNorm,
    password,
    redirectTo: "/dashboard",
  });
  return {};
}
