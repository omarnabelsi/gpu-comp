import { GlassCard } from "@/components/ui/glass-card";
import { auth } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { bem } from "@/lib/bem";
export default async function DashboardOverviewPage() {
  const session = await auth();
  if (!session?.user) {
    return null;
  }
  const role = session.user.role;
  const permissions = session.user.permissions;
  const assignedSections = session.user.assignedSections;
  const canViewBlog = hasPermission(role, permissions, assignedSections, "BLOG");
  const canViewProjects = hasPermission(role, permissions, assignedSections, "PROJECTS");
  const canViewNews = hasPermission(role, permissions, assignedSections, "NEWS");
  const canViewContacts = hasPermission(role, permissions, assignedSections, "CONTACTS");
  const canViewInterests = hasPermission(role, permissions, assignedSections, "INTERESTS");
    const [blogCount, projectCount, newsCount, contactCount, interestCount] = await Promise.all([
    canViewBlog ? prisma.blogPost.count() : 0,
    canViewProjects ? prisma.project.count() : 0,
    canViewNews ? prisma.newsItem.count() : 0,
    canViewContacts ? prisma.contactSubmission.count() : 0,
    canViewInterests ? prisma.projectInterest.count() : 0,
    ]);
    return (<div className={bem("app-dashboard-page__c1")}>
      <div className={bem("app-dashboard-page__c2")} style={{ borderRadius: "14px 2px 14px 2px" }}>
        <p className={bem("app-dashboard-page__c3")}>OPERATIONS</p>
        <h1 className={bem("app-dashboard-page__c4")}>Dashboard Overview</h1>
      </div>
      <div className={bem("app-dashboard-page__c5")}>
        {canViewBlog ? <GlassCard>
          <p className={bem("app-dashboard-page__c6")}>BLOG POSTS</p>
          <p className={bem("app-dashboard-page__c7")}>{blogCount}</p>
        </GlassCard> : null}
        {canViewProjects ? <GlassCard>
          <p className={bem("app-dashboard-page__c8")}>PROJECTS</p>
          <p className={bem("app-dashboard-page__c9")}>{projectCount}</p>
        </GlassCard> : null}
        {canViewNews ? <GlassCard>
          <p className={bem("app-dashboard-page__c10")}>NEWS</p>
          <p className={bem("app-dashboard-page__c11")}>{newsCount}</p>
        </GlassCard> : null}
        {canViewContacts ? <GlassCard>
          <p className={bem("app-dashboard-page__c12")}>CONTACTS</p>
          <p className={bem("app-dashboard-page__c13")}>{contactCount}</p>
        </GlassCard> : null}
        {canViewInterests ? <GlassCard>
          <p className={bem("app-dashboard-page__c14")}>INTERESTS</p>
          <p className={bem("app-dashboard-page__c15")}>{interestCount}</p>
        </GlassCard> : null}
      </div>
    </div>);
}
