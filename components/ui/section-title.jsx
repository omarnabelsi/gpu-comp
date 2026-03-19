import { bem } from "@/lib/bem";
export function SectionTitle({ label, title, description }) {
    return (<div className={bem("components-ui-section-title__c1")}>
      <p className={bem("components-ui-section-title__c2")}>
        {label}
      </p>
      <h2 className={bem("components-ui-section-title__c3")}>{title}</h2>
      {description ? <p className={bem("components-ui-section-title__c4")}>{description}</p> : null}
    </div>);
}
