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
export async function GET(request) {
    const url = new URL(request.url);
    const q = url.searchParams.get("q") || "";
    const pageValue = Number(url.searchParams.get("page") || "1");
    const pageSizeValue = Number(url.searchParams.get("pageSize") || "10");
    const page = Number.isFinite(pageValue) && pageValue > 0 ? pageValue : 1;
    const pageSize = Number.isFinite(pageSizeValue) && pageSizeValue > 0 ? pageSizeValue : 10;
    const where = q
        ? {
            OR: [
                { title: { contains: q } },
                { content: { contains: q } },
            ],
        }
        : undefined;
    const [total, items] = await Promise.all([
        prisma.blogPost.count({ where }),
        prisma.blogPost.findMany({
            where,
            orderBy: { createdAt: "desc" },
            skip: (page - 1) * pageSize,
            take: pageSize,
        }),
    ]);
    return NextResponse.json({
        items,
        total,
        page,
        pageSize,
        totalPages: Math.max(1, Math.ceil(total / pageSize)),
    });
}
export async function POST(request) {
    const access = await requireSection("BLOG");
    if (!access.ok) {
        return access.response;
    }
    const body = await request.json();
    const parsed = blogSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json({ message: "Invalid data" }, { status: 400 });
    }
    const slug = toSlug(parsed.data.title);
    const created = await prisma.blogPost.create({
        data: {
            title: parsed.data.title,
            content: parsed.data.content,
            coverImage: parsed.data.coverImage,
            slug,
        },
    });
    return NextResponse.json(created, { status: 201 });
}
