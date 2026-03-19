import { Container } from "@/components/ui/container";
import { bem } from "@/lib/bem";
export default function LoadingProjectsPage() {
    return (<Container className={bem("app-projects-loading__c1")}>
      <div className={bem("app-projects-loading__c2")}>
        <div className={bem("app-projects-loading__c3")}/>
        <div className={bem("app-projects-loading__c4")}/>
        <div className={bem("app-projects-loading__c5")}/>
      </div>
      <div className={bem("app-projects-loading__c6")}/>
      <div className={bem("app-projects-loading__c7")}>
        <div className={bem("app-projects-loading__c8")}/>
        <div className={bem("app-projects-loading__c9")}/>
        <div className={bem("app-projects-loading__c10")}/>
        <div className={bem("app-projects-loading__c11")}/>
      </div>
    </Container>);
}
