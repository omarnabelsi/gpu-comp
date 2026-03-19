import { requireSection } from "@/lib/api-auth";
import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";
const allowedTypes = ["image/png", "image/jpeg", "image/webp", "image/gif"];
export async function POST(request) {
    const url = new URL(request.url);
    const section = (url.searchParams.get("section") || "").toUpperCase();
    if (section !== "BLOG" && section !== "PROJECTS" && section !== "SITE") {
        return NextResponse.json({ message: "Invalid section" }, { status: 400 });
    }
    const access = await requireSection(section);
    if (!access.ok) {
        return access.response;
    }
    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
        return NextResponse.json({ message: "File is required" }, { status: 400 });
    }
    if (!allowedTypes.includes(file.type)) {
        return NextResponse.json({ message: "Unsupported file type" }, { status: 400 });
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const extension = file.name.split(".").pop() || "png";
    const fileName = `${randomUUID()}.${extension}`;
    const uploadDirectory = path.join(process.cwd(), "public", "uploads", section.toLowerCase());
    await mkdir(uploadDirectory, { recursive: true });
    await writeFile(path.join(uploadDirectory, fileName), buffer);
    return NextResponse.json({
        url: `/uploads/${section.toLowerCase()}/${fileName}`,
    });
}
