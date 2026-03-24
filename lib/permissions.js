import { isAdmin, normalizeRole } from "@/lib/roles";

export function canManageSection(role, assignedSections, section) {
    const normalizedRole = normalizeRole(role);
    const normalizedSection = section.toUpperCase();

    if (isAdmin(normalizedRole)) {
        return true;
    }
    if (normalizedRole !== "EDITOR") {
        return false;
    }
    if (["NEWS", "PROJECTS", "SITE"].includes(normalizedSection)) {
        return true;
    }
    const userSections = assignedSections
        .split(",")
        .map((value) => value.trim().toUpperCase())
        .filter(Boolean);
    return userSections.includes(normalizedSection);
}
