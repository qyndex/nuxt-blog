import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import AppHeader from "../../components/AppHeader.vue";

function mountHeader(path = "/") {
  return mount(AppHeader, {
    global: {
      stubs: {
        NuxtLink: {
          template: '<a :href="$attrs.href || href" v-bind="$attrs"><slot /></a>',
          props: ["href"],
        },
      },
      mocks: {
        $route: { path },
      },
    },
  });
}

describe("AppHeader", () => {
  it("renders the site logo text", () => {
    const wrapper = mountHeader();
    expect(wrapper.find(".logo").text()).toBe("The Dev Blog");
  });

  it("logo has aria-label='Home'", () => {
    const wrapper = mountHeader();
    const logo = wrapper.find(".logo");
    expect(logo.attributes("aria-label")).toBe("Home");
  });

  it("nav has a main navigation aria-label", () => {
    const wrapper = mountHeader();
    const nav = wrapper.find("nav");
    expect(nav.attributes("aria-label")).toBe("Main navigation");
  });

  it("renders Home, About and Archive nav links", () => {
    const wrapper = mountHeader();
    const links = wrapper.findAll("nav a");
    const hrefs = links.map((l) => l.attributes("href"));
    expect(hrefs).toContain("/");
    expect(hrefs).toContain("/about");
    expect(hrefs).toContain("/archive");
  });

  it("renders the header element", () => {
    const wrapper = mountHeader();
    expect(wrapper.find("header").exists()).toBe(true);
  });
});
