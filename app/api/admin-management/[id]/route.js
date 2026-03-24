import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isSuperAdmin, normalizeRole } from "@/lib/roles";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { NextResponse } from "next/server";

async function requireSuperAdmin() {
    const session = await auth();
    if (!session?.user?.id) {
        return { ok: false, response: NextResponse.json({ message: "Unauthorized" }, { status: 401 }) };
    }

    const currentUser = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { id: true, role: true },
    });

    if (!currentUser || !isSuperAdmin(currentUser.role)) {
        return { ok: false, response: NextResponse.json({ message: "Forbidden" }, { status: 403 }) };
    }

    return { ok: true, user: currentUser };
}

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

export async function DELETE(_request, { params }) {
    const access = await requireSuperAdmin();
    if (!access.ok) {
        return access.response;
    }

    const id = params?.id;
    if (!id) {
        return NextResponse.json({ message: "User id is required." }, { status: 400 });
    }

    if (id === access.user.id) {
        return NextResponse.json({ message: "You cannot delete your own account." }, { status: 400 });
    }

    const target = await prisma.user.findUnique({
        where: { id },
        select: { id: true, email: true, role: true },
    });

    if (!target) {
        return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    const targetRole = normalizeRole(target.role);
    if (!["ADMIN", "CUSTOMER"].includes(targetRole)) {
        return NextResponse.json({ message: "This user cannot be deleted." }, { status: 403 });
    }

    await prisma.user.delete({ where: { id: target.id } });

    const supabaseUserId = await findSupabaseUserIdByEmail(target.email);
    if (supabaseUserId) {
        await supabaseAdmin.auth.admin.deleteUser(supabaseUserId);
    }

    return NextResponse.json({ message: "User deleted." });
}