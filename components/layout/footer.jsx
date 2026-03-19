import Link from "next/link";
import { Container } from "@/components/ui/container";
import { bem } from "@/lib/bem";
export function Footer() {
    return (<footer className={bem("components-layout-footer__c1")}>
      <Container className={bem("components-layout-footer__c2")}>
        <p>© {new Date().getFullYear()} GPU Pulse Technologies</p>
        <div className={bem("components-layout-footer__c3")}>
          <Link href="/projects" className={bem("components-layout-footer__c4")}>
            Projects
          </Link>
          <Link href="/services" className={bem("components-layout-footer__c5")}>
            Services
          </Link>
          <Link href="/contact" className={bem("components-layout-footer__c6")}>
            Contact
          </Link>
        </div>
      </Container>
    </footer>);
}
