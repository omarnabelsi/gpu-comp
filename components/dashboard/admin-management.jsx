"use client";

import { useEffect, useMemo, useState } from "react";

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

export function AdminManagement({ initialRole }) {
    const [role, setRole] = useState(() => normalizeInitialRole(initialRole));
    const [admins, setAdmins] = useState([]);
    const [status, setStatus] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
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
            body: JSON.stringify({ name, email, password }),
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
        setShowModal(false);
        setStatus("Admin created.");
    }

    async function handleDeleteAdmin(id) {
        if (!window.confirm("Delete this admin?")) {
            return;
        }

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
        setStatus("Admin deleted.");
    }

    if (!isSuperAdmin) {
        return null;
    }

    return (
        <section id="admin-management" className="surface-panel space-y-4 p-5" style={{ borderRadius: "14px 2px 14px 2px" }}>
            <div className="flex items-center justify-between gap-3">
                <div>
                    <p className="text-xs tracking-[0.2em] text-zinc-400">SECURITY</p>
                    <h2 className="mt-2 text-2xl font-black text-white">Admin Management</h2>
                </div>
                <button className="premium-btn premium-btn-primary premium-control text-white" onClick={() => setShowModal(true)}>
                    Add Admin
                </button>
            </div>

            <div className="overflow-hidden border border-purple-500/40 bg-slate-950/60" style={{ borderRadius: "14px 2px 14px 2px" }}>
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-900 text-zinc-400">
                        <tr>
                            <th className="px-4 py-3">Name</th>
                            <th className="px-4 py-3">Email</th>
                            <th className="px-4 py-3">Role</th>
                            <th className="px-4 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {admins.map((admin) => (
                            <tr key={admin.id} className="border-t border-purple-600/55 text-zinc-300">
                                <td className="px-4 py-3 text-white">{admin.name || "-"}</td>
                                <td className="px-4 py-3">{admin.email}</td>
                                <td className="px-4 py-3 uppercase tracking-[0.12em] text-purple-300">{admin.role}</td>
                                <td className="px-4 py-3">
                                    {admin.role === "admin" ? (
                                        <button
                                            type="button"
                                            className="premium-btn premium-control border-rose-400/70 bg-rose-500/20 text-sm text-rose-200"
                                            onClick={() => handleDeleteAdmin(admin.id)}
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

            {showModal ? (
                <div className="fixed inset-0 z-50 grid place-items-center bg-black/65 p-4">
                    <div className="surface-panel w-full max-w-md space-y-3 p-5" style={{ borderRadius: "16px 3px 16px 3px" }}>
                        <p className="text-xs tracking-[0.2em] text-zinc-400">CREATE ADMIN</p>
                        <h3 className="text-xl font-bold text-white">Add Admin</h3>

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

                            <div className="flex gap-2">
                                <button className="premium-btn premium-btn-primary premium-control text-white" type="submit">
                                    Create
                                </button>
                                <button
                                    className="premium-btn premium-btn-secondary premium-control"
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            ) : null}
        </section>
    );
}