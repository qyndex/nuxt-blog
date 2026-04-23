import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import AppFooter from "../../components/AppFooter.vue";

function mountFooter() {
  return mount(AppFooter);
}

describe("AppFooter", () => {
  it("renders the footer element", () => {
    const wrapper = mountFooter();
    expect(wrapper.find("footer").exists()).toBe(true);
  });

  it("contains current year in copyright notice", () => {
    const wrapper = mountFooter();
    const year = String(new Date().getFullYear());
    expect(wrapper.text()).toContain(year);
  });

  it("contains 'The Dev Blog' branding text", () => {
    const wrapper = mountFooter();
    expect(wrapper.text()).toContain("The Dev Blog");
  });

  it("footer nav has aria-label", () => {
    const wrapper = mountFooter();
    const nav = wrapper.find("nav");
    expect(nav.attributes("aria-label")).toBe("Footer links");
  });

  it("renders RSS link", () => {
    const wrapper = mountFooter();
    const links = wrapper.findAll("a");
    const hrefs = links.map((l) => l.attributes("href"));
    expect(hrefs).toContain("/rss.xml");
  });

  it("renders Privacy link", () => {
    const wrapper = mountFooter();
    const links = wrapper.findAll("a");
    const hrefs = links.map((l) => l.attributes("href"));
    expect(hrefs).toContain("/privacy");
  });

  it("GitHub link opens in a new context safely", () => {
    const wrapper = mountFooter();
    const githubLink = wrapper.findAll("a").find((l) =>
      l.attributes("href")?.includes("github.com")
    );
    expect(githubLink).toBeTruthy();
    expect(githubLink!.attributes("rel")).toContain("noopener");
  });
});
