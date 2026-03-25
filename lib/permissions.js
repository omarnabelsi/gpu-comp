import { isSuperAdmin, normalizeRole } from "@/lib/roles";

export const DASHBOARD_PERMISSION_OPTIONS = [
    { key: "BLOG", label: "Blog" },
    { key: "NEWS", label: "News" },
    { key: "PROJECTS", label: "Projects" },
    { key: "SITE", label: "Site Content" },
    { key: "USERS", label: "Users" },
    { key: "CONTACTS", label: "Contact Submissions" },
    { key: "INTERESTS", label: "Project Interests" },
];

const PERMISSION_ALIASES = {
    BLOG: "BLOG",
    NEWS: "NEWS",
    PROJECTS: "PROJECTS",
    SITE: "SITE",
    USERS: "USERS",
    CONTACTS: "CONTACTS",
    INTERESTS: "INTERESTS",
    ADMIN_MANAGEMENT: "ADMIN_MANAGEMENT",
    PROJECT: "PROJECTS",
    USER: "USERS",
};

function normalizePermission(value) {
    const normalized = String(value ?? "").trim().toUpperCase();
    return PERMISSION_ALIASES[normalized] ?? null;
}

function parseAssignedSections(assignedSections) {
    return String(assignedSections ?? "")
        .split(",")
        .map((value) => normalizePermission(value))
        .filter(Boolean);
}

function defaultPermissionsForRole(role) {
    const normalizedRole = normalizeRole(role);
    if (normalizedRole === "ADMIN") {
        return ["BLOG", "NEWS", "PROJECTS", "SITE", "USERS", "CONTACTS", "INTERESTS"];
    }
    if (normalizedRole === "EDITOR") {
        return ["BLOG", "NEWS", "PROJECTS", "SITE"];
    }
    return [];
}

export function normalizePermissions(role, permissions, assignedSections) {
    if (isSuperAdmin(role)) {
        return ["ALL"];
    }
    const normalizedPermissions = Array.isArray(permissions)
        ? permissions.map((value) => normalizePermission(value)).filter(Boolean)
        : [];
    if (normalizedPermissions.length > 0) {
        return Array.from(new Set(normalizedPermissions));
    }
    const legacyPermissions = parseAssignedSections(assignedSections);
    if (legacyPermissions.length > 0) {
        return Array.from(new Set(legacyPermissions));
    }
    return defaultPermissionsForRole(role);
}

export function hasPermission(role, permissions, assignedSections, permission) {
    const normalizedPermission = normalizePermission(permission);
    if (!normalizedPermission) {
        return false;
    }
    const permissionList = normalizePermissions(role, permissions, assignedSections);
    if (permissionList.includes("ALL")) {
        return true;
    }
    return permissionList.includes(normalizedPermission);
}

export function canManageSection(role, permissions, assignedSections, section) {
    return hasPermission(role, permissions, assignedSections, section);
}
