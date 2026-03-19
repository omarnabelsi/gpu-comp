import { test, expect } from "@playwright/test";
const routes = ["/", "/projects", "/blog", "/news", "/login"];
for (const route of routes) {
    test(`visual snapshot ${route}`, async ({ page }) => {
        await page.goto(route, { waitUntil: "networkidle" });
        await expect(page).toHaveScreenshot(`${route === "/" ? "home" : route.slice(1)}.png`, { fullPage: true });
    });
}
