import bcrypt from "bcryptjs";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isSuperAdmin, toPublicRole } from "@/lib/roles";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { NextResponse } from "next/server";
import { z } from "zod";

const createAdminSchema = z.object({
    name: z.string().trim().min(2),
    email: z.string().trim().email(),
    password: z.string().min(8),
    role: z.enum(["admin", "editor", "super_admin"]).default("admin"),
    permissions: z.array(z.string()).default([]),
});

function toAssignedSections(permissions) {
    const sections = permissions.filter((item) => ["BLOG", "NEWS", "PROJECTS", "SITE"].includes(item));
    if (sections.length === 0) {
        return "BLOG";
    }
    return Array.from(new Set(sections)).join(",");
}

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

export async function GET() {
    const access = await requireSuperAdmin();
    if (!access.ok) {
        return access.response;
    }

    let admins;
    try {
        admins = await prisma.user.findMany({
            where: {
                role: {
                    in: ["SUPER_ADMIN", "ADMIN", "EDITOR"],
                },
            },
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                permissions: true,
            },
        });
    }
    catch {
        const legacyAdmins = await prisma.user.findMany({
            where: {
                role: {
                    in: ["SUPER_ADMIN", "ADMIN", "EDITOR"],
                },
            },
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
            },
        });
        admins = legacyAdmins.map((admin) => ({ ...admin, permissions: [] }));
    }

    return NextResponse.json(
        admins.map((admin) => ({
            ...admin,
            role: toPublicRole(admin.role),
        }))
    );
}

export async function POST(request) {
    const access = await requireSuperAdmin();
    if (!access.ok) {
        return access.response;
    }

    const body = await request.json();
    const parsed = createAdminSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json({ message: "Invalid data" }, { status: 400 });
    }

    const name = parsed.data.name;
    const email = parsed.data.email.toLowerCase();
    const password = parsed.data.password;
    const userRole = parsed.data.role === "editor" ? "EDITOR" : parsed.data.role === "super_admin" ? "SUPER_ADMIN" : "ADMIN";
    const normalizedPermissions = sanitizePermissions(parsed.data.permissions);

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
        return NextResponse.json({ message: "Email is already registered." }, { status: 409 });
    }

    const { data: supabaseUserData, error: supabaseError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { name },
    });

    if (supabaseError) {
        return NextResponse.json({ message: supabaseError.message || "Supabase create user failed." }, { status: 400 });
    }

    const supabaseUserId = supabaseUserData.user?.id ?? null;

    try {
        const hashedPassword = await bcrypt.hash(password, 12);
        try {
            const created = await prisma.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    role: userRole,
                    permissions: normalizedPermissions,
                    assignedSections: toAssignedSections(normalizedPermissions),
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    permissions: true,
                },
            });

            return NextResponse.json({ ...created, role: toPublicRole(created.role) }, { status: 201 });
        }
        catch {
            const createdLegacy = await prisma.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    role: userRole,
                    assignedSections: toAssignedSections(normalizedPermissions),
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                },
            });

            return NextResponse.json({ ...createdLegacy, role: toPublicRole(createdLegacy.role), permissions: [] }, { status: 201 });
        }
    }
    catch {
        if (supabaseUserId) {
            await supabaseAdmin.auth.admin.deleteUser(supabaseUserId);
        }
        return NextResponse.json({ message: "Failed to create user." }, { status: 500 });
    }
}

function sanitizePermissions(values) {
    const allowed = new Set(["BLOG", "NEWS", "PROJECTS", "SITE", "USERS", "CONTACTS", "INTERESTS"]);
    const normalized = Array.isArray(values)
        ? values.map((value) => String(value ?? "").trim().toUpperCase()).filter((value) => allowed.has(value))
        : [];
    return Array.from(new Set(normalized));
}