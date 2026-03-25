import { CustomersTable } from "@/components/dashboard/customers-table";
import { auth } from "@/lib/auth";
import { bem } from "@/lib/bem";
import { hasPermission } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function DashboardCustomersPage() {
    const session = await auth();
    if (!session?.user || !hasPermission(session.user.role, session.user.permissions, session.user.assignedSections, "USERS")) {
        redirect("/dashboard");
    }

    const items = await prisma.user.findMany({
        where: { role: "CUSTOMER" },
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
        },
    });

    return (
        <div className={bem("app-dashboard-interests-page__c1")}>
            <div className={bem("app-dashboard-interests-page__c2")} style={{ borderRadius: "14px 2px 14px 2px" }}>
                <p className={bem("app-dashboard-interests-page__c3")}>USER OPS</p>
                <h1 className={bem("app-dashboard-interests-page__c4")}>Customers</h1>
            </div>
            <CustomersTable initialItems={items} initialRole={session.user.role} />
        </div>
    );
}