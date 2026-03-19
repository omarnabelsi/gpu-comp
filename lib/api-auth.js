import { auth } from "@/lib/auth";
import { canManageSection } from "@/lib/permissions";
import { NextResponse } from "next/server";
export async function requireSection(section) {
    const session = await auth();
    if (!session?.user) {
        return {
            ok: false,
            response: NextResponse.json({ message: "Unauthorized" }, { status: 401 }),
            session: null,
        };
    }
    if (!canManageSection(session.user.role, session.user.assignedSections, section)) {
        return {
            ok: false,
            response: NextResponse.json({ message: "Forbidden" }, { status: 403 }),
            session: null,
        };
    }
    return { ok: true, response: undefined, session };
}
