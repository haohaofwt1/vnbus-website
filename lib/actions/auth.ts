"use server";

import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { setAdminSession, clearAdminSession } from "@/lib/auth";
import { adminLoginSchema } from "@/lib/validators";

export type AdminLoginState = {
  error?: string;
};

export async function loginAdminAction(
  _previousState: AdminLoginState,
  formData: FormData,
): Promise<AdminLoginState> {
  const parsed = adminLoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Please enter your email and password.",
    };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: parsed.data.email },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        passwordHash: true,
      },
    });

    if (!user || !user.passwordHash) {
      return { error: "Invalid email or password." };
    }

    if (user.role !== "ADMIN" && user.role !== "STAFF") {
      return { error: "Your account does not have admin access." };
    }

    const isValidPassword = await bcrypt.compare(parsed.data.password, user.passwordHash);

    if (!isValidPassword) {
      return { error: "Invalid email or password." };
    }

    await setAdminSession({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    redirect("/admin");
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2022"
    ) {
      return {
        error:
          "Database schema is out of date. Run `npx prisma migrate dev` and `npx prisma db seed`, then try again.",
      };
    }

    console.error("Admin login failed.", error);

    return {
      error: "Unable to sign in right now. Please try again after checking the database setup.",
    };
  }
}

export async function logoutAdminAction() {
  await clearAdminSession();
  redirect("/admin/login?loggedOut=1");
}
