import Link from "next/link";
import { Container } from "@/components/ui/container";
import { PaginationLinks } from "@/components/ui/pagination-links";
import { SectionTitle } from "@/components/ui/section-title";
import { getPagination, getTotalPages } from "@/lib/pagination";
import { prisma } from "@/lib/prisma";
import { bem } from "@/lib/bem";
export default async function NewsPage({ searchParams }) {
    const params = await searchParams;
    const query = params.q || "";
    const { page, pageSize, skip } = getPagination(params, 6);
    const where = query
        ? {
            OR: [{ title: { contains: query } }, { content: { contains: query } }],
        }
        : undefined;
    const [total, newsItems] = await Promise.all([
        prisma.newsItem.count({ where }),
        prisma.newsItem.findMany({ where, orderBy: { createdAt: "desc" }, skip, take: pageSize }),
    ]);
    const totalPages = getTotalPages(total, pageSize);
    return (<Container className={bem("app-news-page__c1")}>
      <SectionTitle label="NEWS" title="Company and Product Updates" description="Manufacturing updates, release notes, and field deployment milestones."/>
      <form className={bem("app-news-page__c2")} style={{ borderRadius: "14px 2px 14px 2px" }}>
        <input name="q" defaultValue={query} placeholder="Search news" className={bem("app-news-page__c3")}/>
        <button type="submit" className={bem("app-news-page__c4")}>Search</button>
      </form>
      {newsItems.length === 0 ? (<div className={bem("app-news-page__c5")} style={{ borderRadius: "18px 3px 18px 3px" }}>
          <h3 className={bem("app-news-page__c6")}>No news updates found</h3>
          <p className={bem("app-news-page__c7")}>Try a broader search term to see release updates and milestones.</p>
        </div>) : (<div className={bem("app-news-page__c8")}>
          {newsItems.map((item) => (<article key={item.id} className={bem("app-news-page__c9")} style={{ borderRadius: "18px 3px 18px 3px" }}>
              <p className={bem("app-news-page__c10")}>{new Date(item.createdAt).toLocaleDateString()}</p>
              <h3 className={bem("app-news-page__c11")}>{item.title}</h3>
              <p className={bem("app-news-page__c12")}>{item.content.replace(/<[^>]*>/g, "").slice(0, 180)}...</p>
              <Link href={`/news/${item.slug}`} className={bem("app-news-page__c13")}>
                Read Update
              </Link>
            </article>))}
        </div>)}
      <PaginationLinks pathname="/news" page={page} totalPages={totalPages} query={query}/>
    </Container>);
}
