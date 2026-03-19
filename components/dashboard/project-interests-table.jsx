import { bem } from "@/lib/bem";
export function ProjectInterestsTable({ items }) {
    return (<div className={bem("components-dashboard-project-interests-table__c1")} style={{ borderRadius: "18px 3px 18px 3px" }}>
      <table className={bem("components-dashboard-project-interests-table__c2")}>
        <thead className={bem("components-dashboard-project-interests-table__c3")}>
          <tr>
            <th className={bem("components-dashboard-project-interests-table__c4")}>Name</th>
            <th className={bem("components-dashboard-project-interests-table__c5")}>Email</th>
            <th className={bem("components-dashboard-project-interests-table__c6")}>Project</th>
            <th className={bem("components-dashboard-project-interests-table__c7")}>Date</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (<tr key={item.id} className={bem("components-dashboard-project-interests-table__c8")}>
              <td className={bem("components-dashboard-project-interests-table__c9")}>{item.name}</td>
              <td className={bem("components-dashboard-project-interests-table__c10")}>{item.email}</td>
              <td className={bem("components-dashboard-project-interests-table__c11")}>{item.project.title}</td>
              <td className={bem("components-dashboard-project-interests-table__c12")}>{new Date(item.createdAt).toLocaleDateString()}</td>
            </tr>))}
        </tbody>
      </table>
    </div>);
}
