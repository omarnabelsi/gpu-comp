import { SiteContentManager } from "@/components/dashboard/site-content-manager";
import { auth } from "@/lib/auth";
import { canManageSection } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { bem } from "@/lib/bem";
import { redirect } from "next/navigation";

const requiredHeroSections = [
  {
    key: "HOME",
    title: "Powering the Next Wave of GPU Innovation",
    content: "High-performance graphics and AI hardware designed for fast rendering, stable thermals, and enterprise-ready scaling.",
    ctaText: "Explore GPUs",
    ctaLink: "/projects",
  },
  {
    key: "HOME_BADGE",
    title: "GPU TECHNOLOGY COMPANY",
    content: "GPU TECHNOLOGY COMPANY",
    ctaText: null,
    ctaLink: null,
  },
  {
    key: "HOME_SECONDARY_CTA",
    title: "AI & Cloud Services",
    content: "Explore our enterprise AI and cloud service capabilities.",
    ctaText: "AI & Cloud Services",
    ctaLink: "/services",
  },
  {
    key: "HOME_STAT_1",
    title: "PEAK CLOCK",
    content: "2.8 GHz",
    ctaText: null,
    ctaLink: null,
  },
  {
    key: "HOME_STAT_2",
    title: "AI THROUGHPUT",
    content: "4M tokens/hr",
    ctaText: null,
    ctaLink: null,
  },
  {
    key: "HOME_STAT_3",
    title: "EFFICIENCY",
    content: "380W TDP",
    ctaText: null,
    ctaLink: null,
  },
  {
    key: "HOME_SLIDE_1",
    title: "Hero Slide 1 Image",
    content: "https://i.pinimg.com/736x/93/9f/cf/939fcf0af194a2bf8d53efdbe626309d.jpg",
    ctaText: null,
    ctaLink: null,
  },
  {
    key: "HOME_SLIDE_2",
    title: "Hero Slide 2 Image",
    content: "https://i.pinimg.com/736x/a6/3f/c9/a63fc9ad01c979f90b58d1aadb5279f4.jpg",
    ctaText: null,
    ctaLink: null,
  },
  {
    key: "HOME_SLIDE_3",
    title: "Hero Slide 3 Image",
    content: "https://i.pinimg.com/736x/79/c4/12/79c4125793cf04f6ca6a1c876154fa1b.jpg",
    ctaText: null,
    ctaLink: null,
  },
];

export default async function DashboardSiteContentPage() {
    const session = await auth();
    if (!session?.user) {
        return null;
    }
  const canEdit = canManageSection(session.user.role, session.user.permissions, session.user.assignedSections, "SITE");
  if (!canEdit) {
    redirect("/dashboard");
  }
    const sections = await prisma.siteSection.findMany({ orderBy: { key: "asc" } });
    const existingKeys = new Set(sections.map((section) => section.key));
    const mergedSections = [...sections, ...requiredHeroSections.filter((section) => !existingKeys.has(section.key))].sort((a, b) => a.key.localeCompare(b.key));
    return (<div className={bem("app-dashboard-site-content-page__c1")}>
      <div className={bem("app-dashboard-site-content-page__c2")} style={{ borderRadius: "14px 2px 14px 2px" }}>
        <p className={bem("app-dashboard-site-content-page__c3")}>SITE SYSTEM</p>
        <h1 className={bem("app-dashboard-site-content-page__c4")}>Edit Site Content</h1>
      </div>
      <SiteContentManager sections={mergedSections} canEdit={canEdit}/>
    </div>);
}
