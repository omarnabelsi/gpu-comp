import { prisma } from "@/lib/prisma";
export async function getSiteSection(key) {
    return prisma.siteSection.findUnique({
        where: { key: key.toUpperCase() },
    });
}
export async function getFeaturedProjects(limit = 3) {
    return prisma.project.findMany({
        orderBy: { createdAt: "desc" },
        take: limit,
    });
}
export async function getRecentBlog(limit = 3) {
    return prisma.blogPost.findMany({
        orderBy: { createdAt: "desc" },
        take: limit,
    });
}
export async function getRecentNews(limit = 3) {
    return prisma.newsItem.findMany({
        orderBy: { createdAt: "desc" },
        take: limit,
    });
}
