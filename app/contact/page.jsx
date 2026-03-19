import { ContactForm } from "@/components/forms/contact-form";
import { Container } from "@/components/ui/container";
import { SectionTitle } from "@/components/ui/section-title";
import { bem } from "@/lib/bem";
export default function ContactPage() {
    return (<Container className={bem("app-contact-page__c1")}>
      <SectionTitle label="CONTACT" title="Talk to Our GPU Engineering Team" description="Share your gaming, AI, or rendering requirements and we will respond with a custom solution."/>
      <div className={bem("app-contact-page__c2")}>
        <ContactForm />
      </div>
    </Container>);
}
