import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { ref, readonly } from "vue";
import AppHeader from "../../components/AppHeader.vue";

// Mock useAuth composable
const mockUser = ref(null);
const mockLogout = vi.fn();

vi.stubGlobal("useAuth", () => ({
  user: readonly(mockUser),
  logout: mockLogout,
}));

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

  it("shows Sign In link when not authenticated", () => {
    mockUser.value = null;
    const wrapper = mountHeader();
    const links = wrapper.findAll("nav a");
    const hrefs = links.map((l) => l.attributes("href"));
    expect(hrefs).toContain("/auth/login");
  });

  it("shows My Posts and Sign Out when authenticated", () => {
    mockUser.value = { id: "test-user", email: "test@example.com" } as never;
    const wrapper = mountHeader();
    const links = wrapper.findAll("nav a");
    const hrefs = links.map((l) => l.attributes("href"));
    expect(hrefs).toContain("/admin/posts");
    expect(wrapper.find(".nav-btn").text()).toBe("Sign Out");
  });

  it("calls logout when Sign Out is clicked", async () => {
    mockUser.value = { id: "test-user", email: "test@example.com" } as never;
    const wrapper = mountHeader();
    await wrapper.find(".nav-btn").trigger("click");
    expect(mockLogout).toHaveBeenCalled();
  });

  it("renders the header element", () => {
    const wrapper = mountHeader();
    expect(wrapper.find("header").exists()).toBe(true);
  });
});
