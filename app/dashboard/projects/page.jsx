import { ProjectManager } from "@/components/dashboard/project-manager";
import { PaginationLinks } from "@/components/ui/pagination-links";
import { auth } from "@/lib/auth";
import { getPagination, getTotalPages } from "@/lib/pagination";
import { canManageSection } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { bem } from "@/lib/bem";
import { redirect } from "next/navigation";
export default async function DashboardProjectsPage({ searchParams }) {
    const session = await auth();
    const params = await searchParams;
    const query = params.q || "";
    const { page, pageSize, skip } = getPagination(params, 6);
    if (!session?.user) {
        return null;
    }
    const canEdit = canManageSection(session.user.role, session.user.permissions, session.user.assignedSections, "PROJECTS");
    if (!canEdit) {
      redirect("/dashboard");
    }
    const where = query
        ? {
            OR: [{ title: { contains: query } }, { description: { contains: query } }],
        }
        : undefined;
    const [total, items] = await Promise.all([
        prisma.project.count({ where }),
        prisma.project.findMany({ where, orderBy: { createdAt: "desc" }, skip, take: pageSize }),
    ]);
    const totalPages = getTotalPages(total, pageSize);
    return (<div className={bem("app-dashboard-projects-page__c1")}>
      <div className={bem("app-dashboard-projects-page__c2")} style={{ borderRadius: "14px 2px 14px 2px" }}>
        <p className={bem("app-dashboard-projects-page__c3")}>CONTENT OPS</p>
        <h1 className={bem("app-dashboard-projects-page__c4")}>Manage Projects</h1>
      </div>
      <form className={bem("app-dashboard-projects-page__c5")} style={{ borderRadius: "14px 2px 14px 2px" }}>
        <input name="q" defaultValue={query} placeholder="Search projects" className={bem("app-dashboard-projects-page__c6")}/>
        <button className={bem("app-dashboard-projects-page__c7")}>Search</button>
      </form>
      <ProjectManager initialItems={items} canEdit={canEdit}/>
      <PaginationLinks pathname="/dashboard/projects" page={page} totalPages={totalPages} query={query}/>
    </div>);
}
