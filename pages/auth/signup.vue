<template>
  <main class="auth-page">
    <div class="auth-card">
      <h1>Create Account</h1>
      <p class="subtitle">Join The Dev Blog community</p>

      <div v-if="errorMsg" class="error-banner" role="alert">
        {{ errorMsg }}
      </div>

      <div v-if="successMsg" class="success-banner" role="status">
        {{ successMsg }}
      </div>

      <form v-if="!successMsg" @submit.prevent="handleSignup" novalidate>
        <div class="field">
          <label for="fullName">Full Name</label>
          <input
            id="fullName"
            v-model="fullName"
            type="text"
            placeholder="Jane Doe"
            autocomplete="name"
          />
        </div>

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
            placeholder="At least 6 characters"
            required
            minlength="6"
            autocomplete="new-password"
            aria-required="true"
          />
        </div>

        <button type="submit" class="btn-primary" :disabled="submitting">
          {{ submitting ? "Creating account…" : "Create Account" }}
        </button>
      </form>

      <p class="alt-action">
        Already have an account?
        <NuxtLink href="/auth/login">Sign In</NuxtLink>
      </p>
    </div>
  </main>
</template>

<script setup lang="ts">
definePageMeta({ layout: false });
useHead({ title: "Sign Up — The Dev Blog" });

const { signup } = useAuth();

const fullName = ref("");
const email = ref("");
const password = ref("");
const errorMsg = ref("");
const successMsg = ref("");
const submitting = ref(false);

async function handleSignup() {
  errorMsg.value = "";
  submitting.value = true;

  try {
    if (password.value.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }

    await signup(email.value, password.value, fullName.value || undefined);
    successMsg.value =
      "Account created! Check your email for a confirmation link, then sign in.";
  } catch (err: unknown) {
    errorMsg.value = err instanceof Error ? err.message : "Signup failed. Please try again.";
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

.success-banner {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #166534;
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
