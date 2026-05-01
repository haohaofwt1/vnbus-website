"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ZodError } from "zod";
import { prisma } from "@/lib/prisma";
import { adminBlogSchema } from "@/lib/validators";
import { createAuditLog, getRequiredId, parseFormData, requireAdminUser } from "./helpers";

function withError(path: string, message: string) {
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}error=${encodeURIComponent(message)}`;
}

function resolveBlogErrorMessage(error: unknown) {
  if (error instanceof ZodError) {
    return error.issues[0]?.message ?? "Please check the blog post fields and try again.";
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return "That blog slug already exists. Use a unique slug.";
    }

    if (error.code === "P2025") {
      return "The blog post could not be found.";
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unable to save the blog post right now.";
}

export async function createBlogPostAction(formData: FormData) {
  let post:
    | {
        id: string;
        slug: string;
      }
    | undefined;

  try {
    const session = await requireAdminUser();
    const parsed = adminBlogSchema.parse(parseFormData(formData));
    post = await prisma.blogPost.create({
      data: parsed,
      select: { id: true, slug: true },
    });

    await createAuditLog({
      userId: session.id,
      entityType: "BlogPost",
      entityId: post.id,
      action: "CREATE",
      metadata: { slug: post.slug, status: parsed.status },
    });
  } catch (error) {
    redirect(withError("/admin/blog/new", resolveBlogErrorMessage(error)));
  }

  revalidatePath("/blog");
  revalidatePath(`/blog/${post.slug}`);
  revalidatePath("/admin/blog");
  redirect(`/admin/blog/${post.id}/edit?saved=1`);
}

export async function updateBlogPostAction(formData: FormData) {
  let id = "";
  let currentSlug = "";
  let nextSlug = "";

  try {
    const session = await requireAdminUser();
    id = getRequiredId(formData);
    const parsed = adminBlogSchema.parse(parseFormData(formData));
    nextSlug = parsed.slug;

    const currentPost = await prisma.blogPost.findUnique({
      where: { id },
      select: { slug: true },
    });

    if (!currentPost) {
      throw new Error("The blog post could not be found.");
    }

    currentSlug = currentPost.slug;

    await prisma.blogPost.update({
      where: { id },
      data: parsed,
    });

    await createAuditLog({
      userId: session.id,
      entityType: "BlogPost",
      entityId: id,
      action: "UPDATE",
      metadata: { previousSlug: currentSlug, slug: parsed.slug, status: parsed.status },
    });
  } catch (error) {
    const fallbackId = id || formData.get("id")?.toString() || "";
    redirect(
      withError(
        fallbackId ? `/admin/blog/${fallbackId}/edit` : "/admin/blog",
        resolveBlogErrorMessage(error),
      ),
    );
  }

  revalidatePath("/blog");
  if (currentSlug) {
    revalidatePath(`/blog/${currentSlug}`);
  }
  if (nextSlug && nextSlug !== currentSlug) {
    revalidatePath(`/blog/${nextSlug}`);
  }
  revalidatePath("/admin/blog");
  redirect(`/admin/blog/${id}/edit?saved=1`);
}

export async function archiveBlogPostAction(formData: FormData) {
  let id = "";
  let slug = "";

  try {
    const session = await requireAdminUser();
    id = getRequiredId(formData);

    const archived = await prisma.blogPost.update({
      where: { id },
      data: { status: "DRAFT" },
      select: { slug: true },
    });

    slug = archived.slug;

    await createAuditLog({
      userId: session.id,
      entityType: "BlogPost",
      entityId: id,
      action: "ARCHIVE",
      metadata: { slug },
    });
  } catch (error) {
    redirect(withError("/admin/blog", resolveBlogErrorMessage(error)));
  }

  revalidatePath("/blog");
  if (slug) {
    revalidatePath(`/blog/${slug}`);
  }
  revalidatePath("/admin/blog");
  redirect("/admin/blog?archived=1");
}

export async function deleteBlogPostAction(formData: FormData) {
  let id = "";
  let slug = "";

  try {
    const session = await requireAdminUser();
    id = getRequiredId(formData);

    const deleted = await prisma.blogPost.delete({
      where: { id },
      select: { slug: true },
    });

    slug = deleted.slug;

    await createAuditLog({
      userId: session.id,
      entityType: "BlogPost",
      entityId: id,
      action: "DELETE",
      metadata: { slug },
    });
  } catch (error) {
    redirect(withError("/admin/blog", resolveBlogErrorMessage(error)));
  }

  revalidatePath("/blog");
  if (slug) {
    revalidatePath(`/blog/${slug}`);
  }
  revalidatePath("/admin/blog");
  redirect("/admin/blog?deleted=1");
}
