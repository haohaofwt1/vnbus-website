import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { absoluteUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [routes, operators, cities, blogPosts] = await Promise.all([
    prisma.route.findMany({
      where: { status: "ACTIVE" },
      select: { slug: true, updatedAt: true },
    }),
    prisma.operator.findMany({
      where: { status: "ACTIVE" },
      select: { slug: true, updatedAt: true },
    }),
    prisma.city.findMany({
      select: { slug: true, updatedAt: true },
    }),
    prisma.blogPost.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true },
    }),
  ]);

  return [
    {
      url: absoluteUrl("/"),
      lastModified: new Date(),
    },
    {
      url: absoluteUrl("/search"),
      lastModified: new Date(),
    },
    {
      url: absoluteUrl("/blog"),
      lastModified: new Date(),
    },
    {
      url: absoluteUrl("/faq"),
      lastModified: new Date(),
    },
    {
      url: absoluteUrl("/contact"),
      lastModified: new Date(),
    },
    ...routes.map((route) => ({
      url: absoluteUrl(`/routes/${route.slug}`),
      lastModified: route.updatedAt,
    })),
    ...operators.map((operator) => ({
      url: absoluteUrl(`/operators/${operator.slug}`),
      lastModified: operator.updatedAt,
    })),
    ...cities.map((city) => ({
      url: absoluteUrl(`/destinations/${city.slug}`),
      lastModified: city.updatedAt,
    })),
    ...blogPosts.map((post) => ({
      url: absoluteUrl(`/blog/${post.slug}`),
      lastModified: post.updatedAt,
    })),
  ];
}
