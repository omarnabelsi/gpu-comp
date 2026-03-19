import { Container } from "@/components/ui/container";
import { bem } from "@/lib/bem";
export default function LoadingNewsPage() {
    return (<Container className={bem("app-news-loading__c1")}>
      <div className={bem("app-news-loading__c2")}>
        <div className={bem("app-news-loading__c3")}/>
        <div className={bem("app-news-loading__c4")}/>
        <div className={bem("app-news-loading__c5")}/>
      </div>
      <div className={bem("app-news-loading__c6")}/>
      <div className={bem("app-news-loading__c7")}>
        <div className={bem("app-news-loading__c8")}/>
        <div className={bem("app-news-loading__c9")}/>
        <div className={bem("app-news-loading__c10")}/>
      </div>
    </Container>);
}
