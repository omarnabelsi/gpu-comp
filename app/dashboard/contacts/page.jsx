import { ContactSubmissionsTable } from "@/components/dashboard/contact-submissions-table";
import { auth } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import { bem } from "@/lib/bem";

export const dynamic = "force-dynamic";

export default async function DashboardContactsPage() {
    noStore();
    const session = await auth();
    if (!session?.user || !hasPermission(session.user.role, session.user.permissions, session.user.assignedSections, "CONTACTS")) {
        redirect("/dashboard");
    }
    const items = await prisma.contactSubmission.findMany({
        orderBy: { createdAt: "desc" },
    });
    return (<div className={bem("app-dashboard-contacts-page__c1")}>
      <div className={bem("app-dashboard-contacts-page__c2")} style={{ borderRadius: "14px 2px 14px 2px" }}>
        <p className={bem("app-dashboard-contacts-page__c3")}>INBOX OPS</p>
        <h1 className={bem("app-dashboard-contacts-page__c4")}>Contact Submissions</h1>
      </div>
      <ContactSubmissionsTable items={items}/>
    </div>);
}
