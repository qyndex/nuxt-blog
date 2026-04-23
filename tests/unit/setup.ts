// Stub Nuxt auto-imports so components can be mounted in Vitest without a
// running Nuxt runtime.
import { vi } from "vitest";
import { ref, computed, readonly, reactive, watch, onMounted } from "vue";

// --- Vue reactivity stubs ---
vi.stubGlobal("ref", ref);
vi.stubGlobal("computed", computed);
vi.stubGlobal("readonly", readonly);
vi.stubGlobal("reactive", reactive);
vi.stubGlobal("watch", watch);
vi.stubGlobal("onMounted", onMounted);
vi.stubGlobal("useState", (key: string, init?: () => unknown) => ref(init?.()));

// --- router stubs ---
vi.stubGlobal("useRoute", () => ({ path: "/", params: {}, query: {} }));
vi.stubGlobal("useRouter", () => ({ push: vi.fn(), replace: vi.fn() }));
vi.stubGlobal("navigateTo", vi.fn());
vi.stubGlobal("definePageMeta", vi.fn());

// --- head stubs ---
vi.stubGlobal("useHead", vi.fn());

// --- runtime config stubs ---
vi.stubGlobal("useRuntimeConfig", () => ({
  public: {
    siteName: "The Dev Blog",
    siteDescription: "Test blog",
    supabaseUrl: "http://localhost:54321",
    supabaseKey: "test-anon-key",
  },
  supabaseUrl: "http://localhost:54321",
  supabaseKey: "test-anon-key",
  supabaseServiceKey: "test-service-key",
}));

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

vi.stubGlobal("$fetch", vi.fn());

// --- auth stubs (default: no user) ---
vi.stubGlobal("useAuth", () => ({
  user: readonly(ref(null)),
  session: readonly(ref(null)),
  loading: readonly(ref(false)),
  init: vi.fn(),
  login: vi.fn(),
  signup: vi.fn(),
  logout: vi.fn(),
  getAccessToken: () => null,
  authFetch: vi.fn(),
}));
