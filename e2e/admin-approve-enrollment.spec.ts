import { test, expect } from "@playwright/test";
test("admin approves a pending enrollment", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page.getByRole("heading", { name: /command center/i })).toBeVisible();
  await page.getByRole("link", { name: "Manage Enrollments", exact: true }).click();
  const firstApprove = page.getByRole("button", { name: "Approve" }).first();
  await firstApprove.click();
  await expect(page.getByText("Approved").first()).toBeVisible();
});