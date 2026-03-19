import { requireSection } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
const blogSchema = z.object({
    title: z.string().min(3),
    content: z.string().min(10),
    coverImage: z.string().min(2),
});
function toSlug(text) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
}
export async function PUT(request, context) {
    const access = await requireSection("BLOG");
    if (!access.ok) {
        return access.response;
    }
    const body = await request.json();
    const parsed = blogSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json({ message: "Invalid data" }, { status: 400 });
    }
    const { id } = await context.params;
    const updated = await prisma.blogPost.update({
        where: { id },
        data: {
            title: parsed.data.title,
            content: parsed.data.content,
            coverImage: parsed.data.coverImage,
            slug: toSlug(parsed.data.title),
        },
    });
    return NextResponse.json(updated);
}
export async function DELETE(_, context) {
    const access = await requireSection("BLOG");
    if (!access.ok) {
        return access.response;
    }
    const { id } = await context.params;
    await prisma.blogPost.delete({ where: { id } });
    return NextResponse.json({ success: true });
}
