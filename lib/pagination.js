export function getPagination(searchParams, pageSize = 6) {
    const pageValue = Number(searchParams.page || "1");
    const page = Number.isFinite(pageValue) && pageValue > 0 ? pageValue : 1;
    const skip = (page - 1) * pageSize;
    return {
        page,
        pageSize,
        skip,
    };
}
export function getTotalPages(total, pageSize) {
    return Math.max(1, Math.ceil(total / pageSize));
}
