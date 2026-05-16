import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OperatorProfilePage } from "@/components/operator-profile/OperatorProfilePage";
import { getOperatorBySlug } from "@/lib/data";
import { resolveLocale } from "@/lib/i18n";
import { buildBreadcrumbSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await getOperatorBySlug(slug);

  if (!data) {
    return buildMetadata({
      title: "Không tìm thấy nhà xe",
      description: "Không tìm thấy hồ sơ nhà xe được yêu cầu.",
      path: "/nha-xe",
    });
  }

  return buildMetadata({
    title: `${data.operator.name} | Hồ sơ nhà xe VNBUS`,
    description: data.operator.description,
    path: `/nha-xe/${data.operator.slug}`,
  });
}

export default async function VietnameseOperatorPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string; review?: string }>;
}) {
  const { slug } = await params;
  const search = await searchParams;
  const locale = resolveLocale(search.lang ?? "vi");
  const data = await getOperatorBySlug(slug);

  if (!data) {
    notFound();
  }

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Trang chủ", path: "/" },
    { name: "Nhà xe", path: "/operators" },
    { name: data.operator.name, path: `/nha-xe/${data.operator.slug}` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <OperatorProfilePage data={data} locale={locale} reviewStatus={search.review} />
    </>
  );
}
