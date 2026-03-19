import { auth } from "@/lib/auth";
export default auth((request) => {
    if (!request.auth && request.nextUrl.pathname.startsWith("/dashboard")) {
        const newUrl = new URL("/login", request.nextUrl.origin);
        newUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
        return Response.redirect(newUrl);
    }
    return null;
});
export const config = {
    matcher: ["/dashboard/:path*"],
};
