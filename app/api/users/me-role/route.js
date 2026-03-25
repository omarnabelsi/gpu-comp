import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { toPublicRole } from "@/lib/roles";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true, permissions: true, assignedSections: true },
    });

    if (!user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({
        role: toPublicRole(user.role),
        permissions: Array.isArray(user.permissions) ? user.permissions : [],
        assignedSections: user.assignedSections ?? "",
    });
}