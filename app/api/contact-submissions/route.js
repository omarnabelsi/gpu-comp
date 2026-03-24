import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isSuperAdmin } from "@/lib/roles";
import { NextResponse } from "next/server";
import { z } from "zod";
const submissionSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    message: z.string().min(10),
    reason: z.string().trim().optional(),
});
export async function GET() {
    const session = await auth();
    const role = session?.user?.role;
    if (!session?.user || (!isSuperAdmin(role) && !["ADMIN", "EDITOR"].includes(role))) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    const items = await prisma.contactSubmission.findMany({
        orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(items);
}
export async function POST(request) {
    const body = await request.json();
    const parsed = submissionSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json({ message: "Invalid data" }, { status: 400 });
    }
    const created = await prisma.contactSubmission.create({
        data: parsed.data,
    });
    return NextResponse.json(created, { status: 201 });
}
