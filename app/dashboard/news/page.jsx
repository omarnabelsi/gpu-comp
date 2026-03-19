import { NewsManager } from "@/components/dashboard/news-manager";
import { PaginationLinks } from "@/components/ui/pagination-links";
import { auth } from "@/lib/auth";
import { getPagination, getTotalPages } from "@/lib/pagination";
import { canManageSection } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { bem } from "@/lib/bem";
export default async function DashboardNewsPage({ searchParams }) {
    const session = await auth();
    const params = await searchParams;
    const query = params.q || "";
    const { page, pageSize, skip } = getPagination(params, 6);
    if (!session?.user) {
        return null;
    }
    const where = query
        ? {
            OR: [{ title: { contains: query } }, { content: { contains: query } }],
        }
        : undefined;
    const [total, items] = await Promise.all([
        prisma.newsItem.count({ where }),
        prisma.newsItem.findMany({ where, orderBy: { createdAt: "desc" }, skip, take: pageSize }),
    ]);
    const totalPages = getTotalPages(total, pageSize);
    const canEdit = canManageSection(session.user.role, session.user.assignedSections, "NEWS");
    return (<div className={bem("app-dashboard-news-page__c1")}>
      <div className={bem("app-dashboard-news-page__c2")} style={{ borderRadius: "14px 2px 14px 2px" }}>
        <p className={bem("app-dashboard-news-page__c3")}>UPDATES OPS</p>
        <h1 className={bem("app-dashboard-news-page__c4")}>Manage News</h1>
      </div>
      <form className={bem("app-dashboard-news-page__c5")} style={{ borderRadius: "14px 2px 14px 2px" }}>
        <input name="q" defaultValue={query} placeholder="Search news" className={bem("app-dashboard-news-page__c6")}/>
        <button className={bem("app-dashboard-news-page__c7")}>Search</button>
      </form>
      <NewsManager initialItems={items} canEdit={canEdit}/>
      <PaginationLinks pathname="/dashboard/news" page={page} totalPages={totalPages} query={query}/>
    </div>);
}
