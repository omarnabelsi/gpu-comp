import { GlassCard } from "@/components/ui/glass-card";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { bem } from "@/lib/bem";
export default async function DashboardOverviewPage() {
  const session = await auth();
    const [blogCount, projectCount, newsCount, contactCount, interestCount] = await Promise.all([
        prisma.blogPost.count(),
        prisma.project.count(),
        prisma.newsItem.count(),
        prisma.contactSubmission.count(),
        prisma.projectInterest.count(),
    ]);
    return (<div className={bem("app-dashboard-page__c1")}>
      <div className={bem("app-dashboard-page__c2")} style={{ borderRadius: "14px 2px 14px 2px" }}>
        <p className={bem("app-dashboard-page__c3")}>OPERATIONS</p>
        <h1 className={bem("app-dashboard-page__c4")}>Dashboard Overview</h1>
      </div>
      <div className={bem("app-dashboard-page__c5")}>
        <GlassCard>
          <p className={bem("app-dashboard-page__c6")}>BLOG POSTS</p>
          <p className={bem("app-dashboard-page__c7")}>{blogCount}</p>
        </GlassCard>
        <GlassCard>
          <p className={bem("app-dashboard-page__c8")}>PROJECTS</p>
          <p className={bem("app-dashboard-page__c9")}>{projectCount}</p>
        </GlassCard>
        <GlassCard>
          <p className={bem("app-dashboard-page__c10")}>NEWS</p>
          <p className={bem("app-dashboard-page__c11")}>{newsCount}</p>
        </GlassCard>
        <GlassCard>
          <p className={bem("app-dashboard-page__c12")}>CONTACTS</p>
          <p className={bem("app-dashboard-page__c13")}>{contactCount}</p>
        </GlassCard>
        <GlassCard>
          <p className={bem("app-dashboard-page__c14")}>INTERESTS</p>
          <p className={bem("app-dashboard-page__c15")}>{interestCount}</p>
        </GlassCard>
      </div>
    </div>);
}
