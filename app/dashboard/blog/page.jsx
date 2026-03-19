import { BlogManager } from "@/components/dashboard/blog-manager";
import { PaginationLinks } from "@/components/ui/pagination-links";
import { auth } from "@/lib/auth";
import { getPagination, getTotalPages } from "@/lib/pagination";
import { canManageSection } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { bem } from "@/lib/bem";
export default async function DashboardBlogPage({ searchParams }) {
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
        prisma.blogPost.count({ where }),
        prisma.blogPost.findMany({ where, orderBy: { createdAt: "desc" }, skip, take: pageSize }),
    ]);
    const totalPages = getTotalPages(total, pageSize);
    const canEdit = canManageSection(session.user.role, session.user.assignedSections, "BLOG");
    return (<div className={bem("app-dashboard-blog-page__c1")}>
      <div className={bem("app-dashboard-blog-page__c2")} style={{ borderRadius: "14px 2px 14px 2px" }}>
        <p className={bem("app-dashboard-blog-page__c3")}>EDITORIAL OPS</p>
        <h1 className={bem("app-dashboard-blog-page__c4")}>Manage Blog</h1>
      </div>
      <form className={bem("app-dashboard-blog-page__c5")} style={{ borderRadius: "14px 2px 14px 2px" }}>
        <input name="q" defaultValue={query} placeholder="Search posts" className={bem("app-dashboard-blog-page__c6")}/>
        <button className={bem("app-dashboard-blog-page__c7")}>Search</button>
      </form>
      <BlogManager initialItems={items.map((item) => ({ ...item, createdAt: item.createdAt.toISOString() }))} canEdit={canEdit}/>
      <PaginationLinks pathname="/dashboard/blog" page={page} totalPages={totalPages} query={query}/>
    </div>);
}
