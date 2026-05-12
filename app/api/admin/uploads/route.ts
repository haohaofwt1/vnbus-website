import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";

const allowedMimeTypes = new Map([
  ["image/png", ".png"],
  ["image/jpeg", ".jpg"],
  ["image/webp", ".webp"],
  ["image/svg+xml", ".svg"],
]);

const allowedFolders = new Set(["branding", "operators", "cities", "routes", "vehicles", "blog"]);

export async function POST(request: Request) {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const requestedFolder = formData.get("folder")?.toString() ?? "branding";
  const folder = allowedFolders.has(requestedFolder) ? requestedFolder : "branding";

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
  }

  const extension = allowedMimeTypes.get(file.type);

  if (!extension) {
    return NextResponse.json({ error: "Unsupported file type." }, { status: 400 });
  }

  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "Please upload an image under 5MB." }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const fileName = `${Date.now()}-${randomUUID()}${extension}`;
  const outputDir = path.join(process.cwd(), "public", "uploads", folder);
  const outputPath = path.join(outputDir, fileName);

  await mkdir(outputDir, { recursive: true });
  await writeFile(outputPath, buffer);

  // This local-disk upload works in development and stateful servers.
  // For Vercel production, replace this with persistent object storage.
  return NextResponse.json({
    url: `/uploads/${folder}/${fileName}`,
  });
}
