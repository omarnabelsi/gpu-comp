import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
function toSlug(text) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
}
async function main() {
    const adminPassword = await bcrypt.hash("Admin123!", 10);
    const editorPassword = await bcrypt.hash("Editor123!", 10);
    await prisma.user.upsert({
        where: { email: "admin@gpupulse.com" },
        update: {},
        create: {
            name: "Admin User",
            email: "admin@gpupulse.com",
            password: adminPassword,
            role: "ADMIN",
            assignedSections: "BLOG,PROJECTS,NEWS,SITE",
        },
    });
    await prisma.user.upsert({
        where: { email: "editor@gpupulse.com" },
        update: {},
        create: {
            name: "Blog Editor",
            email: "editor@gpupulse.com",
            password: editorPassword,
            role: "EDITOR",
            assignedSections: "BLOG",
        },
    });
    const projectTitles = [
        "Aurora RTX 9900",
        "NeuralForge A100X",
        "Vortex Lite 780",
    ];
    for (const title of projectTitles) {
        await prisma.project.upsert({
            where: { slug: toSlug(title) },
            update: {},
            create: {
                title,
                slug: toSlug(title),
                description: `${title} delivers high-throughput rendering and AI acceleration for modern workloads.`,
                longDescription: `${title} is engineered for studios, esports teams, and AI labs that need stable performance under heavy sustained load.`,
                imageUrl: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=1200&q=80",
                specs: {
                    memory: "24GB GDDR7",
                    cores: "18432",
                    boostClock: "2.8 GHz",
                    tdp: "380W",
                },
                performanceData: {
                    gaming4k: "216 FPS",
                    aiInference: "4.2M tokens/hour",
                    renderSpeed: "58% faster",
                },
            },
        });
    }
    const blogTitles = [
        "Why Memory Bandwidth Defines Real GPU Speed",
        "Building AI Clusters with Mixed GPU Tiers",
        "Choosing the Right Card for Competitive Gaming",
    ];
    for (const title of blogTitles) {
        await prisma.blogPost.upsert({
            where: { slug: toSlug(title) },
            update: {},
            create: {
                title,
                slug: toSlug(title),
                content: `${title} explains practical architecture decisions, power budgets, and performance tuning strategies for current-generation GPU systems.`,
                coverImage: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=1200&q=80",
            },
        });
    }
    const newsTitles = [
        "GPU Pulse opens new AI compute lab",
        "Partnership announced with cloud rendering provider",
        "Firmware update improves thermal efficiency",
    ];
    for (const title of newsTitles) {
        await prisma.newsItem.upsert({
            where: { slug: toSlug(title) },
            update: {},
            create: {
                title,
                slug: toSlug(title),
                content: `${title} with a focus on production uptime, quality control, and enterprise GPU roadmap delivery.`,
            },
        });
    }
    const sections = [
        {
            key: "HOME",
            title: "Powering the Next Wave of GPU Innovation",
            content: "GPU Pulse builds high-performance graphics and AI hardware that combines premium thermals, sustained clock speeds, and scalable cluster architecture.",
            ctaText: "Explore GPUs",
            ctaLink: "/projects",
        },
        {
            key: "HOME_BADGE",
            title: "GPU TECHNOLOGY COMPANY",
            content: "GPU TECHNOLOGY COMPANY",
            ctaText: null,
            ctaLink: null,
        },
        {
            key: "HOME_SECONDARY_CTA",
            title: "AI & Cloud Services",
            content: "Explore our enterprise AI and cloud service capabilities.",
            ctaText: "AI & Cloud Services",
            ctaLink: "/services",
        },
        {
            key: "HOME_STAT_1",
            title: "PEAK CLOCK",
            content: "2.8 GHz",
            ctaText: null,
            ctaLink: null,
        },
        {
            key: "HOME_STAT_2",
            title: "AI THROUGHPUT",
            content: "4M tokens/hr",
            ctaText: null,
            ctaLink: null,
        },
        {
            key: "HOME_STAT_3",
            title: "EFFICIENCY",
            content: "380W TDP",
            ctaText: null,
            ctaLink: null,
        },
        {
            key: "HOME_SLIDE_1",
            title: "Hero Slide 1 Image",
            content: "https://i.pinimg.com/736x/93/9f/cf/939fcf0af194a2bf8d53efdbe626309d.jpg",
            ctaText: null,
            ctaLink: null,
        },
        {
            key: "HOME_SLIDE_2",
            title: "Hero Slide 2 Image",
            content: "https://i.pinimg.com/736x/a6/3f/c9/a63fc9ad01c979f90b58d1aadb5279f4.jpg",
            ctaText: null,
            ctaLink: null,
        },
        {
            key: "HOME_SLIDE_3",
            title: "Hero Slide 3 Image",
            content: "https://i.pinimg.com/736x/79/c4/12/79c4125793cf04f6ca6a1c876154fa1b.jpg",
            ctaText: null,
            ctaLink: null,
        },
        {
            key: "ABOUT",
            title: "Engineering the Future of Visual and AI Compute",
            content: "Our team blends silicon-level optimization, system integration, and cloud infrastructure expertise to create dependable GPU platforms.",
            ctaText: "Learn Services",
            ctaLink: "/services",
        },
        {
            key: "SERVICES",
            title: "GPU Services for Teams that Ship Fast",
            content: "From custom hardware builds to cloud rendering pipelines and AI acceleration consulting, we help teams turn compute into product velocity.",
            ctaText: "Contact Us",
            ctaLink: "/contact",
        },
    ];
    for (const section of sections) {
        await prisma.siteSection.upsert({
            where: { key: section.key },
            update: section,
            create: section,
        });
    }
}
main()
    .then(async () => {
    await prisma.$disconnect();
})
    .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
});
