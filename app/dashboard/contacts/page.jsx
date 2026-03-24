import { ContactSubmissionsTable } from "@/components/dashboard/contact-submissions-table";
import { auth } from "@/lib/auth";
import { isSuperAdmin } from "@/lib/roles";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { bem } from "@/lib/bem";
export default async function DashboardContactsPage() {
    const session = await auth();
  const role = session?.user?.role;
  if (!session?.user || (!isSuperAdmin(role) && !["ADMIN", "EDITOR"].includes(role))) {
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
