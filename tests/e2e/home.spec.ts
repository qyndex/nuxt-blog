import { test, expect } from "@playwright/test";

test.describe("Home page — blog listing", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("page title is correct", async ({ page }) => {
    await expect(page).toHaveTitle(/The Dev Blog/);
  });

  test("hero heading is visible", async ({ page }) => {
    const heading = page.getByRole("heading", { level: 1 });
    await expect(heading).toBeVisible();
    await expect(heading).toHaveText("The Dev Blog");
  });

  test("at least one blog post card is rendered", async ({ page }) => {
    const grid = page.locator('[aria-label="Blog posts"]');
    await expect(grid).toBeVisible();

    const cards = grid.locator("article");
    await expect(cards).toHaveCount.callsFake === undefined
      ? await expect(cards.first()).toBeVisible()
      : await expect(cards).not.toHaveCount(0);
  });

  test("all three seed posts are visible", async ({ page }) => {
    await expect(
      page.getByText("Building Modern Apps with Nuxt 3")
    ).toBeVisible();
    await expect(
      page.getByText("Writing Type-Safe Composables in Vue 3")
    ).toBeVisible();
    await expect(
      page.getByText("Server Routes and API Design in Nuxt 3")
    ).toBeVisible();
  });

  test("category filter buttons are rendered", async ({ page }) => {
    const allBtn = page.getByRole("button", { name: /all/i });
    await expect(allBtn).toBeVisible();
  });

  test("'All' filter button is active by default", async ({ page }) => {
    const allBtn = page.getByRole("button", { name: /all/i });
    await expect(allBtn).toHaveAttribute("aria-pressed", "true");
  });

  test("clicking a category filters the list", async ({ page }) => {
    // Click the TypeScript category button
    const tsBtn = page.getByRole("button", { name: /typescript/i });
    await tsBtn.click();
    await expect(tsBtn).toHaveAttribute("aria-pressed", "true");

    // TypeScript post should remain visible
    await expect(
      page.getByText("Writing Type-Safe Composables in Vue 3")
    ).toBeVisible();

    // Framework post should be hidden
    await expect(
      page.getByText("Building Modern Apps with Nuxt 3")
    ).not.toBeVisible();
  });

  test("clicking All after filtering restores all posts", async ({ page }) => {
    const tsBtn = page.getByRole("button", { name: /typescript/i });
    await tsBtn.click();

    const allBtn = page.getByRole("button", { name: /all/i });
    await allBtn.click();
    await expect(allBtn).toHaveAttribute("aria-pressed", "true");

    await expect(
      page.getByText("Building Modern Apps with Nuxt 3")
    ).toBeVisible();
  });

  test("site header is visible with The Dev Blog logo", async ({ page }) => {
    const header = page.locator("header.site-header");
    await expect(header).toBeVisible();
    await expect(header.getByRole("link", { name: /home/i })).toBeVisible();
  });

  test("site footer is visible", async ({ page }) => {
    const footer = page.locator("footer.site-footer");
    await expect(footer).toBeVisible();
  });

  test("footer contains RSS link", async ({ page }) => {
    const rssLink = page.locator('footer a[href="/rss.xml"]');
    await expect(rssLink).toBeVisible();
  });
});

test.describe("Home page — post navigation", () => {
  test("clicking a card navigates to the post detail page", async ({ page }) => {
    await page.goto("/");

    const firstCard = page
      .locator('[aria-label="Blog posts"] article')
      .first();
    const linkHref = await firstCard.locator("a").first().getAttribute("href");
    expect(linkHref).toMatch(/^\/posts\//);

    await firstCard.locator("a").first().click();
    await expect(page).toHaveURL(new RegExp(`/posts/`));
  });
});

test.describe("Post detail page", () => {
  test("renders the post title", async ({ page }) => {
    await page.goto("/posts/building-with-nuxt3");
    await expect(
      page.getByRole("heading", { name: "Building Modern Apps with Nuxt 3" })
    ).toBeVisible();
  });

  test("renders the author and read time meta", async ({ page }) => {
    await page.goto("/posts/building-with-nuxt3");
    await expect(page.getByText("Alex Rivera")).toBeVisible();
    await expect(page.getByText(/min read/i)).toBeVisible();
  });

  test("renders Back to All Posts link", async ({ page }) => {
    await page.goto("/posts/building-with-nuxt3");
    const back = page.getByRole("link", { name: /all posts/i });
    await expect(back).toBeVisible();
  });

  test("Back to All Posts navigates home", async ({ page }) => {
    await page.goto("/posts/building-with-nuxt3");
    await page.getByRole("link", { name: /all posts/i }).click();
    await expect(page).toHaveURL("/");
  });

  test("unknown slug renders error state", async ({ page }) => {
    await page.goto("/posts/this-does-not-exist");
    await expect(
      page.getByRole("heading", { name: /not found/i })
    ).toBeVisible();
  });
});
