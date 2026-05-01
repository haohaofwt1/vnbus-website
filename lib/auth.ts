import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  ADMIN_SESSION_COOKIE_NAME,
  ADMIN_SESSION_MAX_AGE,
  type AdminAccessRole,
  createAdminSessionToken,
  verifyAdminSessionToken,
} from "@/lib/admin-session";

export type AdminSession = {
  id: string;
  name: string;
  email: string;
  role: AdminAccessRole;
};

function getAdminCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE,
  };
}

export async function setAdminSession(session: AdminSession) {
  const cookieStore = await cookies();
  const token = await createAdminSessionToken({
    userId: session.id,
    role: session.role,
  });

  cookieStore.set(ADMIN_SESSION_COOKIE_NAME, token, getAdminCookieOptions());
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE_NAME, "", {
    ...getAdminCookieOptions(),
    maxAge: 0,
  });
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE_NAME)?.value;
  const payload = await verifyAdminSessionToken(token);

  if (!payload) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  if (!user || (user.role !== "ADMIN" && user.role !== "STAFF")) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

export async function requireAdminAccess() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  return session;
}

export async function redirectAuthenticatedAdmin() {
  const session = await getAdminSession();

  if (session) {
    redirect("/admin");
  }
}
