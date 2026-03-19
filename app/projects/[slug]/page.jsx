import { notFound } from "next/navigation";
import Image from "next/image";
import { ProjectInterestForm } from "@/components/forms/project-interest-form";
import { Container } from "@/components/ui/container";
import { prisma } from "@/lib/prisma";
import { bem } from "@/lib/bem";
export default async function ProjectDetailsPage({ params }) {
    const { slug } = await params;
    const project = await prisma.project.findUnique({
        where: { slug },
    });
    if (!project) {
        notFound();
    }
    const specs = project.specs;
    const performance = project.performanceData;
    return (<Container className={bem("app-projects-slug-page__c1")}>
      <div className={bem("app-projects-slug-page__c2")} style={{ borderRadius: "24px 4px 24px 4px" }}>
        <p className={bem("app-projects-slug-page__c3")}>PROJECT DETAIL</p>
        <h1 className={bem("app-projects-slug-page__c4")}>{project.title}</h1>
        <p className={bem("app-projects-slug-page__c5")}>{project.longDescription}</p>
        <Image src={project.imageUrl} alt={project.title} width={1200} height={650} className={bem("app-projects-slug-page__c6")} style={{ borderRadius: "16px 3px 16px 3px" }}/>
      </div>

      <div className={bem("app-projects-slug-page__c7")}>
        <div className={bem("app-projects-slug-page__c8")} style={{ borderRadius: "18px 2px 18px 2px" }}>
          <h2 className={bem("app-projects-slug-page__c9")}>Specs</h2>
          <div className={bem("app-projects-slug-page__c10")}>
            {Object.entries(specs).map(([key, value]) => (<p key={key} className={bem("app-projects-slug-page__c11")}>
                <span className={bem("app-projects-slug-page__c12")}>{key}</span>
                <span className={bem("app-projects-slug-page__c13")}>{value}</span>
              </p>))}
          </div>
        </div>
        <div className={bem("app-projects-slug-page__c14")} style={{ borderRadius: "18px 2px 18px 2px" }}>
          <h2 className={bem("app-projects-slug-page__c15")}>Performance</h2>
          <div className={bem("app-projects-slug-page__c16")}>
            {Object.entries(performance).map(([key, value]) => (<p key={key} className={bem("app-projects-slug-page__c17")}>
                <span className={bem("app-projects-slug-page__c18")}>{key}</span>
                <span className={bem("app-projects-slug-page__c19")}>{value}</span>
              </p>))}
          </div>
        </div>
      </div>

      <div className={bem("app-projects-slug-page__c20")}>
        <ProjectInterestForm projectId={project.id} projectTitle={project.title}/>
      </div>
    </Container>);
}
