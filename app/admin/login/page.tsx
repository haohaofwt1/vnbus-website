import { redirectAuthenticatedAdmin } from "@/lib/auth";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ loggedOut?: string }>;
}) {
  const params = await searchParams;
  await redirectAuthenticatedAdmin();

  return (
    <section className="section-space">
      <div className="container-shell">
        <AdminLoginForm loggedOut={Boolean(params.loggedOut)} />
      </div>
    </section>
  );
}
