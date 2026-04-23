<template>
  <main class="auth-page">
    <div class="auth-card">
      <h1>Sign In</h1>
      <p class="subtitle">Welcome back to The Dev Blog</p>

      <div v-if="errorMsg" class="error-banner" role="alert">
        {{ errorMsg }}
      </div>

      <form @submit.prevent="handleLogin" novalidate>
        <div class="field">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="you@example.com"
            required
            autocomplete="email"
            aria-required="true"
          />
        </div>

        <div class="field">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="Your password"
            required
            autocomplete="current-password"
            aria-required="true"
          />
        </div>

        <button type="submit" class="btn-primary" :disabled="submitting">
          {{ submitting ? "Signing in…" : "Sign In" }}
        </button>
      </form>

      <p class="alt-action">
        Don't have an account?
        <NuxtLink href="/auth/signup">Sign Up</NuxtLink>
      </p>
    </div>
  </main>
</template>

<script setup lang="ts">
definePageMeta({ layout: false });
useHead({ title: "Sign In — The Dev Blog" });

const { login } = useAuth();
const router = useRouter();

const email = ref("");
const password = ref("");
const errorMsg = ref("");
const submitting = ref(false);

async function handleLogin() {
  errorMsg.value = "";
  submitting.value = true;

  try {
    await login(email.value, password.value);
    await router.push("/admin/posts");
  } catch (err: unknown) {
    errorMsg.value = err instanceof Error ? err.message : "Login failed. Please try again.";
  } finally {
    submitting.value = false;
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  padding: 2rem;
  font-family: system-ui, -apple-system, sans-serif;
}

.auth-card {
  width: 100%;
  max-width: 24rem;
  background: white;
  border-radius: 0.75rem;
  padding: 2.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

h1 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.25rem;
}

.subtitle {
  color: #64748b;
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
}

.error-banner {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.field {
  margin-bottom: 1rem;
}

label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.375rem;
}

input {
  width: 100%;
  padding: 0.625rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.9375rem;
  color: #1e293b;
  background: white;
  box-sizing: border-box;
}

input:focus {
  outline: 2px solid #3b82f6;
  outline-offset: -1px;
  border-color: #3b82f6;
}

.btn-primary {
  width: 100%;
  padding: 0.625rem;
  background: #1e40af;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 0.5rem;
}

.btn-primary:hover:not(:disabled) {
  background: #1d4ed8;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.alt-action {
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.875rem;
  color: #64748b;
}

.alt-action a {
  color: #1e40af;
  text-decoration: none;
  font-weight: 500;
}

.alt-action a:hover {
  text-decoration: underline;
}
</style>
