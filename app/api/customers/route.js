import { auth } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { isSuperAdmin } from "@/lib/roles";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { NextResponse } from "next/server";

async function findSupabaseUserIdByEmail(email) {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({
        page: 1,
        perPage: 1000,
    });

    if (error) {
        return null;
    }

    const found = data.users.find((item) => item.email?.toLowerCase() === email.toLowerCase());
    return found?.id ?? null;
}

export async function GET() {
    const session = await auth();
    if (!session?.user || !hasPermission(session.user.role, session.user.permissions, session.user.assignedSections, "USERS")) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const items = await prisma.user.findMany({
        where: { role: "CUSTOMER" },
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
        },
    });

    return NextResponse.json(items);
}

export async function DELETE(request) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true },
    });

    if (!currentUser || !isSuperAdmin(currentUser.role)) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
        return NextResponse.json({ message: "Customer id is required." }, { status: 400 });
    }

    const target = await prisma.user.findUnique({
        where: { id },
        select: { id: true, email: true, role: true },
    });

    if (!target || target.role !== "CUSTOMER") {
        return NextResponse.json({ message: "Customer not found." }, { status: 404 });
    }

    await prisma.user.delete({ where: { id: target.id } });

    const supabaseUserId = await findSupabaseUserIdByEmail(target.email);
    if (supabaseUserId) {
        await supabaseAdmin.auth.admin.deleteUser(supabaseUserId);
    }

    return NextResponse.json({ message: "Customer deleted." });
}