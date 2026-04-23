import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import ArticleCard from "../../components/ArticleCard.vue";
import type { PostWithRelations } from "../../types/database";

const stubPost: PostWithRelations = {
  id: "test-id",
  slug: "test-post",
  title: "Test Post Title",
  excerpt: "A short excerpt about the test post.",
  content: "<p>Full content here.</p>",
  cover_image_url: "https://placehold.co/640x360?text=Test",
  category_id: "cat-1",
  author_id: "author-1",
  published: true,
  published_at: "2026-01-20T10:00:00Z",
  created_at: "2026-01-20T10:00:00Z",
  updated_at: "2026-01-20T10:00:00Z",
  categories: {
    id: "cat-1",
    name: "TypeScript",
    slug: "typescript",
    created_at: "2026-01-01T00:00:00Z",
  },
  profiles: {
    id: "author-1",
    username: "janedoe",
    full_name: "Jane Doe",
    avatar_url: null,
    bio: null,
    created_at: "2026-01-01T00:00:00Z",
  },
};

function mountCard(post: PostWithRelations = stubPost) {
  return mount(ArticleCard, {
    props: { post },
    global: {
      stubs: { NuxtLink: { template: '<a v-bind="$attrs"><slot /></a>' } },
    },
  });
}

describe("ArticleCard", () => {
  it("renders post title", () => {
    const wrapper = mountCard();
    expect(wrapper.find("h2").text()).toBe(stubPost.title);
  });

  it("renders post excerpt", () => {
    const wrapper = mountCard();
    expect(wrapper.find(".excerpt").text()).toBe(stubPost.excerpt);
  });

  it("renders author full_name from profile", () => {
    const wrapper = mountCard();
    expect(wrapper.text()).toContain("Jane Doe");
  });

  it("renders category name from relation", () => {
    const wrapper = mountCard();
    expect(wrapper.find(".category").text()).toBe("TypeScript");
  });

  it("link href points to the post slug", () => {
    const wrapper = mountCard();
    const link = wrapper.find("a");
    expect(link.attributes("href")).toBe(`/posts/${stubPost.slug}`);
  });

  it("link has aria-label equal to the post title", () => {
    const wrapper = mountCard();
    const link = wrapper.find("a");
    expect(link.attributes("aria-label")).toBe(stubPost.title);
  });

  it("image has correct src and alt attributes", () => {
    const wrapper = mountCard();
    const img = wrapper.find("img");
    expect(img.attributes("src")).toBe(stubPost.cover_image_url);
    expect(img.attributes("alt")).toBe(stubPost.title);
  });

  it("image uses lazy loading", () => {
    const wrapper = mountCard();
    expect(wrapper.find("img").attributes("loading")).toBe("lazy");
  });

  it("shows placeholder when no cover_image_url", () => {
    const postNoCover = { ...stubPost, cover_image_url: null };
    const wrapper = mountCard(postNoCover);
    expect(wrapper.find(".cover-placeholder").exists()).toBe(true);
    expect(wrapper.find("img").exists()).toBe(false);
  });

  it("renders formatted date from published_at", () => {
    const wrapper = mountCard();
    // "Jan 20" format (short month + day)
    expect(wrapper.text()).toContain("Jan");
  });
});
