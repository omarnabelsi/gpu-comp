import { auth } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
const submissionSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    message: z.string().trim().min(3),
    reason: z.string().trim().optional(),
});
export async function GET() {
    const session = await auth();
    if (!session?.user || !hasPermission(session.user.role, session.user.permissions, session.user.assignedSections, "CONTACTS")) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    const items = await prisma.contactSubmission.findMany({
        orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(items);
}
export async function POST(request) {
    try {
        const body = await request.json();
        const parsed = submissionSchema.safeParse(body);
        if (!parsed.success) {
            const firstIssue = parsed.error.issues[0];
            return NextResponse.json({ message: firstIssue?.message ?? "Invalid data" }, { status: 400 });
        }
        const created = await prisma.contactSubmission.create({
            data: parsed.data,
        });
        return NextResponse.json(created, { status: 201 });
    }
    catch {
        return NextResponse.json({ message: "Unable to submit right now" }, { status: 500 });
    }
}
