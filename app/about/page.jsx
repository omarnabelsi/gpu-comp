import { Container } from "@/components/ui/container";
import { SectionTitle } from "@/components/ui/section-title";
import { getSiteSection } from "@/lib/site-data";
import { bem } from "@/lib/bem";
export default async function AboutPage() {
    const section = await getSiteSection("ABOUT");
    return (<Container className={bem("app-about-page__c1")}>
      <SectionTitle label="ABOUT" title={section?.title || "About GPU Pulse"} description={section?.content}/>
      <div className={bem("app-about-page__c2")}>
        <div className={bem("app-about-page__c3")} style={{ borderRadius: "18px 3px 18px 3px" }}>
          <h3 className={bem("app-about-page__c4")}>Vision</h3>
          <p className={bem("app-about-page__c5")}>We make GPU hardware that powers immersive graphics and AI systems with stable long-run performance.</p>
        </div>
        <div className={bem("app-about-page__c6")} style={{ borderRadius: "18px 3px 18px 3px" }}>
          <h3 className={bem("app-about-page__c7")}>Innovation</h3>
          <p className={bem("app-about-page__c8")}>Our engineering stack spans board design, thermal architecture, and tuned firmware for production use.</p>
        </div>
        <div className={bem("app-about-page__c9")} style={{ borderRadius: "18px 3px 18px 3px" }}>
          <h3 className={bem("app-about-page__c10")}>Reliability</h3>
          <p className={bem("app-about-page__c11")}>From gaming rigs to enterprise AI clusters, every build is tested for sustained peak workloads.</p>
        </div>
      </div>
    </Container>);
}
