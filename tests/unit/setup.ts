// Stub Nuxt auto-imports so components can be mounted in Vitest without a
// running Nuxt runtime.
import { vi } from "vitest";
import { ref, computed } from "vue";

// --- router stubs ---
vi.stubGlobal("useRoute", () => ({ path: "/", params: {}, query: {} }));
vi.stubGlobal("useRouter", () => ({ push: vi.fn(), replace: vi.fn() }));

// --- head stubs ---
vi.stubGlobal("useHead", vi.fn());

// --- fetch stubs (overridden per-test as needed) ---
vi.stubGlobal("useLazyFetch", () => ({
  data: ref(null),
  pending: ref(false),
  error: ref(null),
  refresh: vi.fn(),
}));

vi.stubGlobal("useFetch", () => ({
  data: ref(null),
  pending: ref(false),
  error: ref(null),
  refresh: vi.fn(),
}));

// --- Nuxt NuxtLink stub ---
// @vue/test-utils handles unknown components gracefully; stubs registered here
// prevent console warnings.
