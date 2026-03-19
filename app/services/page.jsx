import { Container } from "@/components/ui/container";
import { SectionTitle } from "@/components/ui/section-title";
import { getSiteSection } from "@/lib/site-data";
import { bem } from "@/lib/bem";
const services = [
    {
        title: "GPU Solutions",
        description: "Custom hardware selection and optimization for studios and game teams.",
    },
    {
        title: "AI Computing",
        description: "Scale model training and inference with balanced power and throughput.",
    },
    {
        title: "Cloud Rendering",
        description: "Build low-latency render infrastructure for animation and VFX workloads.",
    },
    {
        title: "Custom Builds",
        description: "End-to-end integration for enterprise labs and high-end gaming environments.",
    },
];
export default async function ServicesPage() {
    const section = await getSiteSection("SERVICES");
    return (<Container className={bem("app-services-page__c1")}>
      <SectionTitle label="SERVICES" title={section?.title || "Services"} description={section?.content}/>
      <div className={bem("app-services-page__c2")}>
        {services.map((service) => (<div key={service.title} className={bem("app-services-page__c3")} style={{ borderRadius: "18px 3px 18px 3px" }}>
            <h3 className={bem("app-services-page__c4")}>{service.title}</h3>
            <p className={bem("app-services-page__c5")}>{service.description}</p>
          </div>))}
      </div>
    </Container>);
}
