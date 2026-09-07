import { test as setup, expect } from "@playwright/test";
setup("authenticate as admin", async ({ page }) => {
  const adminEmail = process.env["TMS_ADMIN_EMAIL"] ?? process.env["TMS_ADMIN_USER"];
  const adminPassword = process.env["TMS_ADMIN_PASS"];
  if (!adminEmail || !adminPassword) {
    throw new Error(
      "Missing Playwright admin credentials. In this PowerShell session set TMS_ADMIN_EMAIL and TMS_ADMIN_PASS before running npx playwright test.",
    );
  }
  await page.goto("/login");
  await page.getByLabel(/email|username/i).fill(adminEmail);
  await page.getByLabel("Password").fill(adminPassword);
  await page.getByRole("button", { name: "Sign In" }).click();
  await expect(page.getByRole("heading", { name: /command center/i })).toBeVisible();
  await page.context().storageState({ path: "playwright/.auth/admin.json" });
});