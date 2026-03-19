import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { prisma } from "@/lib/prisma";
import { bem } from "@/lib/bem";
export default async function NewsDetailsPage({ params }) {
    const { slug } = await params;
    const newsItem = await prisma.newsItem.findUnique({
        where: { slug },
    });
    if (!newsItem) {
        notFound();
    }
    return (<Container className={bem("app-news-slug-page__c1")}>
      <div>
        <p className={bem("app-news-slug-page__c2")}>{new Date(newsItem.createdAt).toLocaleDateString()}</p>
        <h1 className={bem("app-news-slug-page__c3")}>{newsItem.title}</h1>
      </div>
      <div className={bem("app-news-slug-page__c4")}/>
      <article className={bem("app-news-slug-page__c5")} dangerouslySetInnerHTML={{ __html: newsItem.content }}/>
    </Container>);
}
