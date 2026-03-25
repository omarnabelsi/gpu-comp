import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { canManageSection, hasPermission } from "@/lib/permissions";
import { isSuperAdmin, normalizeRole } from "@/lib/roles";
import { Container } from "@/components/ui/container";
import { bem } from "@/lib/bem";
export default async function DashboardLayout({ children }) {
    const session = await auth();
    if (!session?.user) {
        redirect("/login");
    }
    const role = session.user.role;
    if (normalizeRole(role) === "CUSTOMER") {
    redirect("/");
    }
    const permissions = session.user.permissions;
    const assigned = session.user.assignedSections;
    const navItems = [
        { href: "/dashboard", label: "Overview", show: true },
        { href: "/dashboard/blog", label: "Blog", show: canManageSection(role, permissions, assigned, "BLOG") },
        { href: "/dashboard/projects", label: "Projects", show: canManageSection(role, permissions, assigned, "PROJECTS") },
        { href: "/dashboard/news", label: "News", show: canManageSection(role, permissions, assigned, "NEWS") },
        { href: "/dashboard/site-content", label: "Site Content", show: canManageSection(role, permissions, assigned, "SITE") },
        { href: "/dashboard/customers", label: "Customers", show: hasPermission(role, permissions, assigned, "USERS") },
        { href: "/dashboard/contacts", label: "Contact Submissions", show: hasPermission(role, permissions, assigned, "CONTACTS") },
        { href: "/dashboard/interests", label: "Project Interests", show: hasPermission(role, permissions, assigned, "INTERESTS") },
        { href: "/dashboard/admin-management", label: "Admin Management", show: isSuperAdmin(role) },
    ];
    return (<Container className={bem("app-dashboard-layout__c1")}>
      <aside className={bem("app-dashboard-layout__c2")} style={{ borderRadius: "20px 3px 20px 3px" }}>
        <p className={bem("app-dashboard-layout__c3")}>ACCESS LEVEL</p>
        <p className={bem("app-dashboard-layout__c4")}>{session.user.role}</p>
        <nav className={bem("app-dashboard-layout__c5")}>
          {navItems
            .filter((item) => item.show)
            .map((item) => (<Link key={item.href} href={item.href} className={bem("app-dashboard-layout__c6")} style={{ borderRadius: "10px 2px 10px 2px" }}>
                {item.label}
              </Link>))}
        </nav>
      </aside>
      <main className={bem("app-dashboard-layout__c7")}>{children}</main>
    </Container>);
}
