"use client";

import { useEffect, useMemo, useState } from "react";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { Modal } from "@/components/ui/modal";
import { DASHBOARD_PERMISSION_OPTIONS } from "@/lib/permissions";

function normalizeInitialRole(role) {
    const value = String(role ?? "").trim().toUpperCase();
    if (value === "SUPER_ADMIN") {
        return "super_admin";
    }
    if (value === "ADMIN") {
        return "admin";
    }
    if (value === "EDITOR") {
        return "editor";
    }
    return "customer";
}

export function AdminManagement({ initialRole }) {
    const [role, setRole] = useState(() => normalizeInitialRole(initialRole));
    const [admins, setAdmins] = useState([]);
    const [status, setStatus] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [confirmDeleteId, setConfirmDeleteId] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newRole, setNewRole] = useState("admin");
    const [selectedPermissions, setSelectedPermissions] = useState(["BLOG", "NEWS"]);
    const isSuperAdmin = useMemo(() => role === "super_admin", [role]);

    useEffect(() => {
        let isMounted = true;

        async function run() {
            const response = await fetch("/api/users/me-role", { cache: "no-store" });
            if (!response.ok || !isMounted) {
                return;
            }
            const data = await response.json();
            if (!isMounted) {
                return;
            }
            setRole(data.role || "customer");
        }

        run();

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        if (!isSuperAdmin) {
            return;
        }

        let isMounted = true;

        async function run() {
            const response = await fetch("/api/admin-management", { cache: "no-store" });
            if (!isMounted) {
                return;
            }
            if (!response.ok) {
                setAdmins([]);
                const payload = await response.json().catch(() => null);
                setStatus(payload?.message || "Could not load users.");
                return;
            }
            const data = await response.json();
            if (!isMounted) {
                return;
            }
            setAdmins(Array.isArray(data) ? data : []);
        }

        run();

        return () => {
            isMounted = false;
        };
    }, [isSuperAdmin]);

    async function handleCreateAdmin(event) {
        event.preventDefault();
        setStatus("");

        const response = await fetch("/api/admin-management", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password, role: newRole, permissions: selectedPermissions }),
        });

        const data = await response.json();
        if (!response.ok) {
            setStatus(data.message || "Could not create admin.");
            return;
        }

        setAdmins((prev) => [data, ...prev]);
        setName("");
        setEmail("");
        setPassword("");
        setNewRole("admin");
        setSelectedPermissions(["BLOG", "NEWS"]);
        setShowModal(false);
        setStatus("User created.");
    }

    async function handleDeleteAdmin(id) {
        setStatus("");
        const response = await fetch(`/api/admin-management/${id}`, {
            method: "DELETE",
        });

        const data = await response.json();
        if (!response.ok) {
            setStatus(data.message || "Could not delete admin.");
            return;
        }

        setAdmins((prev) => prev.filter((item) => item.id !== id));
        setStatus("User deleted.");
        setConfirmDeleteId("");
    }

    function togglePermission(key) {
        setSelectedPermissions((prev) => (prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]));
    }

    if (!isSuperAdmin) {
        return null;
    }

    return (
        <section id="admin-management" className="surface-panel space-y-4 p-4 sm:p-5" style={{ borderRadius: "14px 2px 14px 2px" }}>
            <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                    <p className="text-xs tracking-[0.2em] text-zinc-400">SECURITY</p>
                    <h2 className="mt-2 text-2xl font-black text-white">Admin Management</h2>
                </div>
                <button className="premium-btn premium-btn-primary premium-control w-full text-white sm:w-auto" onClick={() => setShowModal(true)}>
                    Add User
                </button>
            </div>

            <div className="overflow-x-auto border border-purple-500/40 bg-slate-950/60" style={{ borderRadius: "14px 2px 14px 2px" }}>
                <table className="min-w-[620px] w-full text-left text-sm">
                    <thead className="bg-slate-900 text-zinc-400">
                        <tr>
                            <th className="px-3 py-3 sm:px-4">Name</th>
                            <th className="px-3 py-3 sm:px-4">Email</th>
                            <th className="px-3 py-3 sm:px-4">Role</th>
                            <th className="px-3 py-3 sm:px-4">Permissions</th>
                            <th className="px-3 py-3 sm:px-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {admins.map((admin) => (
                            <tr key={admin.id} className="border-t border-purple-600/55 text-zinc-300">
                                <td className="px-3 py-3 text-white sm:px-4">{admin.name || "-"}</td>
                                <td className="px-3 py-3 break-all sm:px-4">{admin.email}</td>
                                <td className="px-3 py-3 uppercase tracking-[0.12em] text-purple-300 sm:px-4">{admin.role}</td>
                                <td className="px-3 py-3 text-zinc-300 sm:px-4">
                                    {Array.isArray(admin.permissions) && admin.permissions.length > 0 ? admin.permissions.join(", ").toLowerCase() : "-"}
                                </td>
                                <td className="px-3 py-3 sm:px-4">
                                    {admin.role !== "super_admin" ? (
                                        <button
                                            type="button"
                                            className="premium-btn premium-control border-rose-400/70 bg-rose-500/20 px-3 py-1 text-sm text-rose-200"
                                            onClick={() => setConfirmDeleteId(admin.id)}
                                        >
                                            Delete
                                        </button>
                                    ) : null}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {status ? <p className="text-sm text-zinc-300">{status}</p> : null}

            <Modal open={showModal} title="Add User" onClose={() => setShowModal(false)}>
                <form onSubmit={handleCreateAdmin} className="space-y-3">
                    <input
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        className="premium-input"
                        placeholder="Name"
                        required
                    />
                    <input
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        className="premium-input"
                        placeholder="Email"
                        type="email"
                        required
                    />
                    <input
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        className="premium-input"
                        placeholder="Password"
                        type="password"
                        required
                        minLength={8}
                    />
                    <select value={newRole} onChange={(event) => setNewRole(event.target.value)} className="premium-input" required>
                        <option value="admin">Admin</option>
                        <option value="editor">Editor</option>
                        <option value="super_admin">Super Admin</option>
                    </select>

                    <div className="surface-panel space-y-2 p-3" style={{ borderRadius: "12px 2px 12px 2px" }}>
                        <p className="text-xs tracking-[0.18em] text-zinc-400">PERMISSIONS</p>
                        <div className="grid gap-2 sm:grid-cols-2">
                            {DASHBOARD_PERMISSION_OPTIONS.map((option) => (
                                <label key={option.key} className="flex items-center gap-2 text-sm text-zinc-300">
                                    <input
                                        type="checkbox"
                                        checked={selectedPermissions.includes(option.key)}
                                        onChange={() => togglePermission(option.key)}
                                    />
                                    {option.label}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="dashboard-modal-actions">
                        <button className="premium-btn premium-btn-secondary premium-control" type="button" onClick={() => setShowModal(false)}>
                            Cancel
                        </button>
                        <button className="premium-btn premium-btn-primary premium-control text-white" type="submit">
                            Create
                        </button>
                    </div>
                </form>
            </Modal>

            <ConfirmationDialog
                open={Boolean(confirmDeleteId)}
                message="Are you sure you want to delete this?"
                confirmText="Confirm"
                cancelText="Cancel"
                onCancel={() => setConfirmDeleteId("")}
                onConfirm={() => handleDeleteAdmin(confirmDeleteId)}
            />
        </section>
    );
}