import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
const interestSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    projectId: z.string().min(1),
});
export async function GET() {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    const items = await prisma.projectInterest.findMany({
        include: { project: true },
        orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(items);
}
export async function POST(request) {
    const body = await request.json();
    const parsed = interestSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json({ message: "Invalid data" }, { status: 400 });
    }
    const created = await prisma.projectInterest.create({
        data: parsed.data,
    });
    return NextResponse.json(created, { status: 201 });
}
