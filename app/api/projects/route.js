import { requireSection } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
const projectSchema = z.object({
    title: z.string().min(3),
    description: z.string().min(10),
    longDescription: z.string().min(20),
    imageUrl: z.string().min(2),
    specs: z.string().min(2),
    performanceData: z.string().min(2),
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
                { description: { contains: q } },
                { longDescription: { contains: q } },
            ],
        }
        : undefined;
    const [total, items] = await Promise.all([
        prisma.project.count({ where }),
        prisma.project.findMany({
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
    const access = await requireSection("PROJECTS");
    if (!access.ok) {
        return access.response;
    }
    const body = await request.json();
    const parsed = projectSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json({ message: "Invalid data" }, { status: 400 });
    }
    let specsValue;
    let performanceValue;
    try {
        specsValue = JSON.parse(parsed.data.specs);
        performanceValue = JSON.parse(parsed.data.performanceData);
    }
    catch {
        return NextResponse.json({ message: "Invalid JSON format" }, { status: 400 });
    }
    const created = await prisma.project.create({
        data: {
            title: parsed.data.title,
            slug: toSlug(parsed.data.title),
            description: parsed.data.description,
            longDescription: parsed.data.longDescription,
            imageUrl: parsed.data.imageUrl,
            specs: specsValue,
            performanceData: performanceValue,
        },
    });
    return NextResponse.json(created, { status: 201 });
}
