export function normalizeRole(role) {
    return String(role ?? "").trim().toUpperCase();
}

export function isSuperAdmin(role) {
    return normalizeRole(role) === "SUPER_ADMIN";
}

export function isCustomer(role) {
    return normalizeRole(role) === "CUSTOMER";
}

export function isAdmin(role) {
    const value = normalizeRole(role);
    return value === "ADMIN" || value === "SUPER_ADMIN";
}

export function canViewCustomers(role) {
    return isAdmin(role);
}

export function toPublicRole(role) {
    const value = normalizeRole(role);
    if (value === "SUPER_ADMIN") {
        return "super_admin";
    }
    if (value === "ADMIN") {
        return "admin";
    }
    return "customer";
}