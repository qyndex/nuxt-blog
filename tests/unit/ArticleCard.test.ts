import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import ArticleCard from "../../components/ArticleCard.vue";
import type { Post } from "../../server/api/posts.get";

const stubPost: Post = {
  slug: "test-post",
  title: "Test Post Title",
  excerpt: "A short excerpt about the test post.",
  content: "<p>Full content here.</p>",
  author: "Jane Doe",
  date: "2026-01-20",
  category: "typescript",
  cover: "https://placehold.co/640x360?text=Test",
  readTime: 4,
};

function mountCard(post: Post = stubPost) {
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

  it("renders author name", () => {
    const wrapper = mountCard();
    expect(wrapper.text()).toContain(stubPost.author);
  });

  it("renders category badge", () => {
    const wrapper = mountCard();
    expect(wrapper.find(".category").text()).toBe(stubPost.category);
  });

  it("renders read-time", () => {
    const wrapper = mountCard();
    expect(wrapper.text()).toContain(`${stubPost.readTime} min read`);
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
    expect(img.attributes("src")).toBe(stubPost.cover);
    expect(img.attributes("alt")).toBe(stubPost.title);
  });

  it("image uses lazy loading", () => {
    const wrapper = mountCard();
    expect(wrapper.find("img").attributes("loading")).toBe("lazy");
  });
});
