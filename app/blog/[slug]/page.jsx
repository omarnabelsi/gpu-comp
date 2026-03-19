import { notFound } from "next/navigation";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { prisma } from "@/lib/prisma";
import { bem } from "@/lib/bem";
export default async function BlogDetailsPage({ params }) {
    const { slug } = await params;
    const post = await prisma.blogPost.findUnique({
        where: { slug },
    });
    if (!post) {
        notFound();
    }
    return (<Container className={bem("app-blog-slug-page__c1")}>
      <div className={bem("app-blog-slug-page__c2")}>
        <div className={bem("app-blog-slug-page__c3")}>
          <p className={bem("app-blog-slug-page__c4")}>{new Date(post.createdAt).toLocaleDateString()}</p>
          <h1 className={bem("app-blog-slug-page__c5")}>{post.title}</h1>
        </div>
      </div>
      <Image src={post.coverImage} alt={post.title} width={1200} height={650} className={bem("app-blog-slug-page__c6")} style={{ borderRadius: "20px 4px 20px 4px" }}/>
      <article className={bem("app-blog-slug-page__c7")} dangerouslySetInnerHTML={{ __html: post.content }}/>
    </Container>);
}
