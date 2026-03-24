"use client";

import { useMemo, useState } from "react";
import { normalizeRole } from "@/lib/roles";

export function CustomersTable({ initialItems, initialRole }) {
    const [items, setItems] = useState(initialItems);
    const [status, setStatus] = useState("");
    const canDelete = useMemo(() => normalizeRole(initialRole) === "SUPER_ADMIN", [initialRole]);

    async function handleDelete(id) {
        if (!window.confirm("Delete this customer?")) {
            return;
        }

        setStatus("");
        const response = await fetch(`/api/customers?id=${id}`, { method: "DELETE" });
        const data = await response.json();

        if (!response.ok) {
            setStatus(data.message || "Could not delete customer.");
            return;
        }

        setItems((prev) => prev.filter((item) => item.id !== id));
        setStatus("Customer deleted.");
    }

    return (
        <div className="overflow-hidden border border-purple-500/40 bg-slate-950/60" style={{ borderRadius: "18px 3px 18px 3px" }}>
            <table className="w-full text-left text-sm">
                <thead className="bg-slate-900 text-zinc-400">
                    <tr>
                        <th className="px-4 py-3">Name</th>
                        <th className="px-4 py-3">Email</th>
                        <th className="px-4 py-3">Role</th>
                        <th className="px-4 py-3">Created</th>
                        {canDelete ? <th className="px-4 py-3">Actions</th> : null}
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => (
                        <tr key={item.id} className="border-t border-purple-600/55 text-zinc-300">
                            <td className="px-4 py-3 text-white">{item.name || "-"}</td>
                            <td className="px-4 py-3">{item.email}</td>
                            <td className="px-4 py-3 tracking-[0.12em] text-purple-300">customer</td>
                            <td className="px-4 py-3 text-zinc-400">{new Date(item.createdAt).toLocaleDateString()}</td>
                            {canDelete ? (
                                <td className="px-4 py-3">
                                    <button
                                        type="button"
                                        className="premium-btn premium-control border-rose-400/70 bg-rose-500/20 px-3 py-1 text-sm text-rose-200"
                                        onClick={() => handleDelete(item.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            ) : null}
                        </tr>
                    ))}
                </tbody>
            </table>
            {status ? <p className="px-4 py-3 text-sm text-zinc-300">{status}</p> : null}
        </div>
    );
}