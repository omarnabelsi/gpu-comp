import { ProjectInterestsTable } from "@/components/dashboard/project-interests-table";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { bem } from "@/lib/bem";
export default async function DashboardInterestsPage() {
    const session = await auth();
    if (!session?.user || !["ADMIN", "EDITOR"].includes(session.user.role)) {
        redirect("/dashboard");
    }
    const items = await prisma.projectInterest.findMany({
        include: { project: true },
        orderBy: { createdAt: "desc" },
    });
    return (<div className={bem("app-dashboard-interests-page__c1")}>
      <div className={bem("app-dashboard-interests-page__c2")} style={{ borderRadius: "14px 2px 14px 2px" }}>
        <p className={bem("app-dashboard-interests-page__c3")}>PIPELINE OPS</p>
        <h1 className={bem("app-dashboard-interests-page__c4")}>Project Interests</h1>
      </div>
      <ProjectInterestsTable items={items}/>
    </div>);
}
