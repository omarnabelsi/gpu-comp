import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { PaginationLinks } from "@/components/ui/pagination-links";
import { SectionTitle } from "@/components/ui/section-title";
import { getPagination, getTotalPages } from "@/lib/pagination";
import { prisma } from "@/lib/prisma";
import { bem } from "@/lib/bem";
export default async function ProjectsPage({ searchParams }) {
    const params = await searchParams;
    const query = params.q || "";
    const { page, pageSize, skip } = getPagination(params, 6);
    const where = query
        ? {
            OR: [{ title: { contains: query } }, { description: { contains: query } }],
        }
        : undefined;
    const [total, projects] = await Promise.all([
        prisma.project.count({ where }),
        prisma.project.findMany({ where, orderBy: { createdAt: "desc" }, skip, take: pageSize }),
    ]);
    const totalPages = getTotalPages(total, pageSize);
    return (<Container className={bem("app-projects-page__c1")}>
      <SectionTitle label="PROJECTS" title="GPU Projects and Systems" description="Hardware systems tuned for long duty cycles, visual compute, and AI throughput."/>
      <form className={bem("app-projects-page__c2")} style={{ borderRadius: "16px 3px 16px 3px" }}>
        <input name="q" defaultValue={query} placeholder="Search projects" className={bem("app-projects-page__c3")}/>
        <button type="submit" className={bem("app-projects-page__c4")}>Search</button>
      </form>
      {projects.length === 0 ? (<div className={bem("app-projects-page__c5")} style={{ borderRadius: "18px 3px 18px 3px" }}>
          <h3 className={bem("app-projects-page__c6")}>No projects found</h3>
          <p className={bem("app-projects-page__c7")}>Adjust your search and browse the full portfolio of GPU builds.</p>
        </div>) : (<div className={bem("app-projects-page__c8")}>
          {projects.map((project) => (<article key={project.id} className={bem("app-projects-page__c9")} style={{ borderRadius: "20px 4px 20px 4px" }}>
              <Image src={project.imageUrl} alt={project.title} width={1200} height={600} sizes="(max-width: 768px) 94vw, (max-width: 1200px) 48vw, 42vw" className={bem("app-projects-page__c10")} style={{ borderRadius: "14px 2px 14px 2px" }}/>
              <div className={bem("app-projects-page__c11")}>
                <h3 className={bem("app-projects-page__c12")}>{project.title}</h3>
                <span className={bem("app-projects-page__c13")}>BUILD</span>
              </div>
              <p className={bem("app-projects-page__c14")}>{project.description}</p>
              <div className={bem("app-projects-page__c15")}>
                <span className={bem("app-projects-page__c16")}>Thermal tuned</span>
                <span className={bem("app-projects-page__c17")}>Latency verified</span>
              </div>
              <Link href={`/projects/${project.slug}`} className={bem("app-projects-page__c18")}>
                View Project
              </Link>
            </article>))}
        </div>)}
      <PaginationLinks pathname="/projects" page={page} totalPages={totalPages} query={query}/>
    </Container>);
}
