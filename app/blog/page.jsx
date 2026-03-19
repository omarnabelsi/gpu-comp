import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { PaginationLinks } from "@/components/ui/pagination-links";
import { SectionTitle } from "@/components/ui/section-title";
import { getPagination, getTotalPages } from "@/lib/pagination";
import { prisma } from "@/lib/prisma";
import { bem } from "@/lib/bem";
export default async function BlogPage({ searchParams }) {
    const params = await searchParams;
    const query = params.q || "";
    const { page, pageSize, skip } = getPagination(params, 6);
    const where = query
        ? {
            OR: [{ title: { contains: query } }, { content: { contains: query } }],
        }
        : undefined;
    const [total, posts] = await Promise.all([
        prisma.blogPost.count({ where }),
        prisma.blogPost.findMany({ where, orderBy: { createdAt: "desc" }, skip, take: pageSize }),
    ]);
    const totalPages = getTotalPages(total, pageSize);
    return (<Container className={bem("app-blog-page__c1")}>
      <SectionTitle label="BLOG" title="GPU Insights and Engineering Stories" description="Editorial notes on architecture, cooling, benchmarking, and production lessons."/>
      <form className={bem("app-blog-page__c2")} style={{ borderRadius: "14px 2px 14px 2px" }}>
        <input name="q" defaultValue={query} placeholder="Search blog posts" className={bem("app-blog-page__c3")}/>
        <button type="submit" className={bem("app-blog-page__c4")}>Search</button>
      </form>
      {posts.length === 0 ? (<div className={bem("app-blog-page__c5")} style={{ borderRadius: "18px 3px 18px 3px" }}>
          <h3 className={bem("app-blog-page__c6")}>No blog posts found</h3>
          <p className={bem("app-blog-page__c7")}>Try a different search phrase or clear filters to explore all engineering stories.</p>
        </div>) : (<div className={bem("app-blog-page__c8")}>
          {posts.map((post, index) => (<article key={post.id} className={bem("app-blog-page__c9")}>
              <Link href={`/blog/${post.slug}`} className={bem("app-blog-page__c15", index % 2 === 0 ? "app-blog-page__c16" : "app-blog-page__c17")}>
                <Image src={post.coverImage} alt={post.title} width={1200} height={700} sizes="(max-width: 768px) 94vw, (max-width: 1200px) 44vw, 36vw" className={bem("app-blog-page__c10")} style={{ borderRadius: "18px 4px 18px 4px" }}/>
              </Link>
              <div className={bem("app-blog-page__c18", index % 2 === 0 ? "app-blog-page__c19" : "app-blog-page__c20")}>
                <p className={bem("app-blog-page__c11")}>{new Date(post.createdAt).toLocaleDateString()}</p>
                <h3 className={bem("app-blog-page__c12")}>{post.title}</h3>
                <p className={bem("app-blog-page__c13")}>{post.content.replace(/<[^>]*>/g, "").slice(0, 180)}...</p>
                <Link href={`/blog/${post.slug}`} className={bem("app-blog-page__c14")}>
                  Read More
                </Link>
              </div>
            </article>))}
        </div>)}
      <PaginationLinks pathname="/blog" page={page} totalPages={totalPages} query={query}/>
    </Container>);
}
