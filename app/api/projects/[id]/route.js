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
export async function PUT(request, context) {
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
    const { id } = await context.params;
    const updated = await prisma.project.update({
        where: { id },
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
    return NextResponse.json(updated);
}
export async function DELETE(_, context) {
    const access = await requireSection("PROJECTS");
    if (!access.ok) {
        return access.response;
    }
    const { id } = await context.params;
    await prisma.project.delete({ where: { id } });
    return NextResponse.json({ success: true });
}
