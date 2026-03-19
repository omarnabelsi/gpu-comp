import { bem } from "@/lib/bem";
function truncateText(value, max = 80) {
    if (value.length <= max) {
        return value;
    }
    return `${value.slice(0, max - 1)}…`;
}
export function ContactSubmissionsTable({ items }) {
    return (<div className={bem("components-dashboard-contact-submissions-table__c1")} style={{ borderRadius: "18px 3px 18px 3px" }}>
      <table className={bem("components-dashboard-contact-submissions-table__c2")}>
        <thead className={bem("components-dashboard-contact-submissions-table__c3")}>
          <tr>
            <th className={bem("components-dashboard-contact-submissions-table__c4")}>Name</th>
            <th className={bem("components-dashboard-contact-submissions-table__c5")}>Email</th>
            <th className={bem("components-dashboard-contact-submissions-table__c6")}>Message</th>
            <th className={bem("components-dashboard-contact-submissions-table__c7")}>Reason</th>
            <th className={bem("components-dashboard-contact-submissions-table__c8")}>Date</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (<tr key={item.id} className={bem("components-dashboard-contact-submissions-table__c9")}>
              <td className={bem("components-dashboard-contact-submissions-table__c10")}>{item.name}</td>
              <td className={bem("components-dashboard-contact-submissions-table__c11")}>{item.email}</td>
              <td className={bem("components-dashboard-contact-submissions-table__c12")}>{item.message}</td>
              <td className={bem("components-dashboard-contact-submissions-table__c13")}>
                {item.reason?.trim() ? (<span title={item.reason}>{truncateText(item.reason)}</span>) : ("-")}
              </td>
              <td className={bem("components-dashboard-contact-submissions-table__c14")}>{new Date(item.createdAt).toLocaleDateString()}</td>
            </tr>))}
        </tbody>
      </table>
    </div>);
}
