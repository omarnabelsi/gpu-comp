import { redirect } from "next/navigation";
import { AdminManagement } from "@/components/dashboard/admin-management";
import { auth } from "@/lib/auth";
import { isSuperAdmin } from "@/lib/roles";

export default async function DashboardAdminManagementPage() {
    const session = await auth();
    if (!session?.user || !isSuperAdmin(session.user.role)) {
        redirect("/dashboard");
    }

    return <AdminManagement initialRole={session.user.role} />;
}