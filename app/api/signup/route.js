import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { supabaseAdmin } from "@/lib/supabase-admin";
export async function POST(request) {
    let createdSupabaseUserId = null;
    try {
        const body = (await request.json());
        const name = (body.name || "").trim();
        const email = (body.email || "").trim().toLowerCase();
        const password = body.password || "";
        if (!name || !email || !password) {
            return NextResponse.json({ message: "Name, email, and password are required." }, { status: 400 });
        }
        if (password.length < 8) {
            return NextResponse.json({ message: "Password must be at least 8 characters." }, { status: 400 });
        }
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return NextResponse.json({ message: "Email is already registered." }, { status: 409 });
        }
        const { data: supabaseUserData, error: supabaseError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { name },
        });
        if (supabaseError) {
            return NextResponse.json({ message: supabaseError.message || "Supabase signup failed." }, { status: 400 });
        }
        createdSupabaseUserId = supabaseUserData.user?.id ?? null;
        const hashedPassword = await bcrypt.hash(password, 12);
        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });
        return NextResponse.json({ message: "Account created successfully." }, { status: 201 });
    }
    catch {
        if (createdSupabaseUserId) {
            await supabaseAdmin.auth.admin.deleteUser(createdSupabaseUserId);
        }
        return NextResponse.json({ message: "Failed to create account." }, { status: 500 });
    }
}
