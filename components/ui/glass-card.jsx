import { bem } from "@/lib/bem";

export function GlassCard({ children, className = "" }) {
    return (<div className={`${bem("components-ui-glass-card__c1")} ${className}`.trim()} style={{ borderRadius: "18px 4px 18px 4px" }}>
      {children}
    </div>);
}
