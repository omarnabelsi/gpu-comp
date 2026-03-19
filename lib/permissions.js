export function canManageSection(role, assignedSections, section) {
    if (role === "ADMIN") {
        return true;
    }
    if (role !== "EDITOR") {
        return false;
    }
    const userSections = assignedSections
        .split(",")
        .map((value) => value.trim().toUpperCase())
        .filter(Boolean);
    return userSections.includes(section.toUpperCase());
}
