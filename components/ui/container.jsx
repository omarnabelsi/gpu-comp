import { bem } from "@/lib/bem";

export function Container({ children, className = "" }) {
    return <div className={`${bem("components-ui-container__c1")} ${className}`.trim()}>{children}</div>;
}
