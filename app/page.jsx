import { Container } from "@/components/ui/container";
import { GlassCard } from "@/components/ui/glass-card";
import { SectionTitle } from "@/components/ui/section-title";
import { HeroSlider } from "@/components/home/hero-slider";
import { PremiumGpuGrid } from "@/components/home/premium-gpu-grid";
import { Reveal } from "@/components/home/reveal";
import { prisma } from "@/lib/prisma";
import { bem } from "@/lib/bem";

const heroSectionDefaults = {
  HOME: {
    key: "HOME",
    title: "Powering the Next Wave of GPU Innovation",
    content: "High-performance graphics and AI hardware designed for fast rendering, stable thermals, and enterprise-ready scaling.",
    ctaText: "Explore GPUs",
    ctaLink: "/projects",
  },
  HOME_BADGE: {
    key: "HOME_BADGE",
    title: "GPU TECHNOLOGY COMPANY",
    content: "GPU TECHNOLOGY COMPANY",
    ctaText: null,
    ctaLink: null,
  },
  HOME_SECONDARY_CTA: {
    key: "HOME_SECONDARY_CTA",
    title: "AI & Cloud Services",
    content: "Explore our enterprise AI and cloud service capabilities.",
    ctaText: "AI & Cloud Services",
    ctaLink: "/services",
  },
  HOME_STAT_1: {
    key: "HOME_STAT_1",
    title: "PEAK CLOCK",
    content: "2.8 GHz",
    ctaText: null,
    ctaLink: null,
  },
  HOME_STAT_2: {
    key: "HOME_STAT_2",
    title: "AI THROUGHPUT",
    content: "4M tokens/hr",
    ctaText: null,
    ctaLink: null,
  },
  HOME_STAT_3: {
    key: "HOME_STAT_3",
    title: "EFFICIENCY",
    content: "380W TDP",
    ctaText: null,
    ctaLink: null,
  },
  HOME_SLIDE_1: {
    key: "HOME_SLIDE_1",
    title: "Hero Slide 1 Image",
    content: "https://i.pinimg.com/736x/93/9f/cf/939fcf0af194a2bf8d53efdbe626309d.jpg",
    ctaText: null,
    ctaLink: null,
  },
  HOME_SLIDE_2: {
    key: "HOME_SLIDE_2",
    title: "Hero Slide 2 Image",
    content: "https://i.pinimg.com/736x/a6/3f/c9/a63fc9ad01c979f90b58d1aadb5279f4.jpg",
    ctaText: null,
    ctaLink: null,
  },
  HOME_SLIDE_3: {
    key: "HOME_SLIDE_3",
    title: "Hero Slide 3 Image",
    content: "https://i.pinimg.com/736x/79/c4/12/79c4125793cf04f6ca6a1c876154fa1b.jpg",
    ctaText: null,
    ctaLink: null,
  },
};

export default async function HomePage() {
  const [featuredProjects, heroSections] = await Promise.all([
    prisma.project.findMany({
      orderBy: { createdAt: "desc" },
      take: 3,
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        imageUrl: true,
      },
    }),
    prisma.siteSection.findMany({
      where: { key: { in: Object.keys(heroSectionDefaults) } },
      select: {
        key: true,
        title: true,
        content: true,
        ctaText: true,
        ctaLink: true,
      },
    }),
  ]);
  const heroByKey = heroSections.reduce((accumulator, section) => {
    accumulator[section.key] = section;
    return accumulator;
  }, {});
  const homeSection = heroByKey.HOME || heroSectionDefaults.HOME;
  const badgeSection = heroByKey.HOME_BADGE || heroSectionDefaults.HOME_BADGE;
  const secondarySection = heroByKey.HOME_SECONDARY_CTA || heroSectionDefaults.HOME_SECONDARY_CTA;
  const heroContent = {
    badge: badgeSection.title || heroSectionDefaults.HOME_BADGE.title,
    title: homeSection.title || heroSectionDefaults.HOME.title,
    description: homeSection.content || heroSectionDefaults.HOME.content,
    primaryCtaLabel: homeSection.ctaText || heroSectionDefaults.HOME.ctaText,
    primaryCtaLink: homeSection.ctaLink || heroSectionDefaults.HOME.ctaLink,
    secondaryCtaLabel: secondarySection.ctaText || secondarySection.title || heroSectionDefaults.HOME_SECONDARY_CTA.ctaText,
    secondaryCtaLink: secondarySection.ctaLink || heroSectionDefaults.HOME_SECONDARY_CTA.ctaLink,
    metrics: ["HOME_STAT_1", "HOME_STAT_2", "HOME_STAT_3"].map((key) => {
      const entry = heroByKey[key] || heroSectionDefaults[key];
      return {
        label: entry.title,
        value: entry.content,
      };
    }),
    slideImages: ["HOME_SLIDE_1", "HOME_SLIDE_2", "HOME_SLIDE_3"].map((key) => {
      const entry = heroByKey[key] || heroSectionDefaults[key];
      return entry.content;
    }),
  };
    return (<div className={bem("app-page__c1")}>
      <div className={bem("app-page__c2")}>
    <HeroSlider heroContent={heroContent} />
      </div>

      <Container className={bem("app-page__c3")}>
        <Reveal>
          <SectionTitle label="PERFORMANCE RAIL" title="High-Performance Systems Built for Gaming and AI" description="Designed as thermal-first platforms with sustained clocks and deterministic frame pacing under long-running workloads."/>
        </Reveal>
        <Reveal>
          <div className={bem("app-page__c4")}>
            <p>RUNTIME STABILITY: 99.97%</p>
            <p>HEAT DELTA: -14.3%</p>
            <p>LATENCY FLOOR: 3.4ms</p>
          </div>
        </Reveal>
        <PremiumGpuGrid projects={featuredProjects}/>
      </Container>

      <Container>
        <Reveal>
          <div className={bem("app-page__c5")}>
            <GlassCard className={bem("app-page__c6")}>
              <p className={bem("app-page__c7")}>REAL-TIME GAMING</p>
              <p className={bem("app-page__c8")}>200+ FPS</p>
              <p className={bem("app-page__c9")}>4K Ultra presets with frame-time consistency tuned for competitive play.</p>
            </GlassCard>
            <GlassCard className={bem("app-page__c10")}>
              <p className={bem("app-page__c11")}>AI THROUGHPUT</p>
              <p className={bem("app-page__c12")}>4M</p>
              <p className={bem("app-page__c13")}>tokens/hr</p>
            </GlassCard>
            <GlassCard className={bem("app-page__c14")}>
              <p className={bem("app-page__c15")}>RENDER SPEED</p>
              <p className={bem("app-page__c16")}>58% Faster</p>
              <p className={bem("app-page__c17")}>Compared with previous generation workstation stacks.</p>
            </GlassCard>
          </div>
        </Reveal>
      </Container>

      <Container>
        <Reveal>
          <section className={bem("app-page__c18")} style={{ borderRadius: "24px 4px 24px 4px" }}>
            <div>
              <p className={bem("app-page__c19")}>DEPLOYMENT CHAPTER</p>
              <h3 className={bem("app-page__c20")}>From single GPU towers to multi-rack AI clusters.</h3>
              <p className={bem("app-page__c21")}>
                We orchestrate cooling architecture, firmware profiles, and telemetry so your systems can stay near peak output without thermal debt.
              </p>
            </div>
            <div className={bem("app-page__c22")}>
              {featuredProjects.map((item) => (<div key={item.id} className={bem("app-page__c23")}>
                  <span className={bem("app-page__c24")}>{item.title}</span>
                  <span className={bem("app-page__c25")}>ACTIVE</span>
                </div>))}
            </div>
          </section>
        </Reveal>
      </Container>
    </div>);
}
