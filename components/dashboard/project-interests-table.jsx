"use client";

import { useEffect, useMemo, useState } from "react";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { bem } from "@/lib/bem";

function normalizeInitialRole(role) {
    const value = String(role ?? "").trim().toUpperCase();
    if (value === "SUPER_ADMIN") {
        return "super_admin";
    }
    if (value === "ADMIN") {
        return "admin";
    }
    return "customer";
}

export function ProjectInterestsTable({ items: initialItems, initialRole }) {
    const [items, setItems] = useState(initialItems);
    const [role, setRole] = useState(() => normalizeInitialRole(initialRole));
    const [status, setStatus] = useState("");
    const [pendingDeleteId, setPendingDeleteId] = useState("");
    const canDelete = useMemo(() => role === "super_admin", [role]);

    useEffect(() => {
        let cancelled = false;

        async function loadRole() {
            const response = await fetch("/api/users/me-role", { cache: "no-store" });
            if (!response.ok) {
                return;
            }
            const data = await response.json();
            if (!cancelled) {
                setRole(data.role || "customer");
            }
        }

        loadRole();

        return () => {
            cancelled = true;
        };
    }, []);

    async function handleDelete(id) {
        const response = await fetch(`/api/project-interests?id=${id}`, {
            method: "DELETE",
        });

        const data = await response.json();
        if (!response.ok) {
            setStatus(data.message || "Could not delete customer.");
            return;
        }

        setItems((prev) => prev.filter((item) => item.id !== id));
        setStatus("Customer deleted.");
        setPendingDeleteId("");
    }

    return (<div className={`${bem("components-dashboard-project-interests-table__c1")} x-scrollbar`} style={{ borderRadius: "18px 3px 18px 3px" }}>
        <table className={`${bem("components-dashboard-project-interests-table__c2")} min-w-[620px]`}>
          <thead className={bem("components-dashboard-project-interests-table__c3")}>
            <tr>
              <th className={bem("components-dashboard-project-interests-table__c4")}>Name</th>
              <th className={bem("components-dashboard-project-interests-table__c5")}>Email</th>
              <th className={bem("components-dashboard-project-interests-table__c6")}>Project</th>
              <th className={bem("components-dashboard-project-interests-table__c7")}>Date</th>
              {canDelete ? <th className={bem("components-dashboard-project-interests-table__c7")}>Actions</th> : null}
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (<tr key={item.id} className={bem("components-dashboard-project-interests-table__c8")}>
                <td className={bem("components-dashboard-project-interests-table__c9")}>{item.name}</td>
                <td className={`${bem("components-dashboard-project-interests-table__c10")} break-all`}>{item.email}</td>
                <td className={`${bem("components-dashboard-project-interests-table__c11")} break-words`}>{item.project?.title || "-"}</td>
                <td className={bem("components-dashboard-project-interests-table__c12")}>{new Date(item.createdAt).toLocaleDateString()}</td>
                {canDelete ? (<td className={bem("components-dashboard-project-interests-table__c12")}>
                    <button
                      type="button"
                      className="premium-btn premium-control border-rose-400/70 bg-rose-500/20 px-3 py-1 text-sm text-rose-200"
                      onClick={() => setPendingDeleteId(item.id)}
                    >
                      Delete
                    </button>
                  </td>) : null}
              </tr>))}
          </tbody>
        </table>
            {status ? <p className="px-4 py-3 text-sm text-zinc-300">{status}</p> : null}
            <ConfirmationDialog
                open={Boolean(pendingDeleteId)}
                message="Are you sure you want to delete this?"
                confirmText="Confirm"
                cancelText="Cancel"
                onCancel={() => setPendingDeleteId("")}
                onConfirm={() => handleDelete(pendingDeleteId)}
            />
    </div>);
}
