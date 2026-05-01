import { AdminLayout as AdminShell } from "@/components/admin/AdminLayout";
import { getAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAdminSession();
  return <AdminShell user={user}>{children}</AdminShell>;
}
