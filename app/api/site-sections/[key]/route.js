import { requireSection } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
const sectionSchema = z.object({
    title: z.string().min(3),
    content: z.string().min(1),
    ctaText: z.string().optional().nullable(),
    ctaLink: z.string().optional().nullable(),
});
export async function PUT(request, context) {
    const access = await requireSection("SITE");
    if (!access.ok) {
        return access.response;
    }
    const { key } = await context.params;
    const body = await request.json();
    const parsed = sectionSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json({ message: "Invalid data" }, { status: 400 });
    }
    const updated = await prisma.siteSection.upsert({
        where: { key: key.toUpperCase() },
        update: {
            title: parsed.data.title,
            content: parsed.data.content,
            ctaText: parsed.data.ctaText,
            ctaLink: parsed.data.ctaLink,
        },
        create: {
            key: key.toUpperCase(),
            title: parsed.data.title,
            content: parsed.data.content,
            ctaText: parsed.data.ctaText,
            ctaLink: parsed.data.ctaLink,
        },
    });
    return NextResponse.json(updated);
}
