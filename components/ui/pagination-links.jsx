import Link from "next/link";
import { bem } from "@/lib/bem";
export function PaginationLinks({ pathname, page, totalPages, query = "" }) {
    function buildHref(nextPage) {
        const params = new URLSearchParams();
        if (query) {
            params.set("q", query);
        }
        params.set("page", String(nextPage));
        return `${pathname}?${params.toString()}`;
    }
    return (<div className={bem("components-ui-pagination-links__c1")} style={{ borderRadius: "14px 2px 14px 2px" }}>
      <Link href={buildHref(Math.max(1, page - 1))} className={bem("components-ui-pagination-links__c3", page <= 1 ? "components-ui-pagination-links__c4" : "components-ui-pagination-links__c5")}>
        Previous
      </Link>
      <p className={bem("components-ui-pagination-links__c2")}>
        Page {page} of {totalPages}
      </p>
      <Link href={buildHref(Math.min(totalPages, page + 1))} className={bem("components-ui-pagination-links__c3", page >= totalPages ? "components-ui-pagination-links__c4" : "components-ui-pagination-links__c5")}>
        Next
      </Link>
    </div>);
}
