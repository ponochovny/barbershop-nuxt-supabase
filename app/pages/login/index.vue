<script setup lang="ts">
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const email = ref("");
const password = ref("");
const isLogin = ref(true);
const errorMsg = ref("");

// If the user is already logged in, redirect him
watchEffect(() => {
  if (user.value) {
    navigateTo("/dashboard");
  }
});

async function handleAuth() {
  errorMsg.value = "";
  try {
    if (isLogin.value) {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value,
      });
      if (error) throw error;
    } else {
      const { error } = await supabase.auth.signUp({
        email: email.value,
        password: password.value,
        options: {
          data: { full_name: "New Client" }, // Will get into profile via trigger
        },
      });
      if (error) throw error;
      alert("Registration successful! Check email or login.");
    }
  } catch (error: any) {
    errorMsg.value = error.message;
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-50 p-4">
    <div class="w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow-md">
      <h1 class="text-2xl font-bold text-center">
        {{ isLogin ? "Login" : "Register" }}
      </h1>

      <form @submit.prevent="handleAuth" class="space-y-4">
        <div>
          <label class="block text-sm font-medium">Email</label>
          <input
            v-model="email"
            type="email"
            class="w-full mt-1 p-2 border rounded"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium">Password</label>
          <input
            v-model="password"
            type="password"
            class="w-full mt-1 p-2 border rounded"
            required
          />
        </div>

        <p v-if="errorMsg" class="text-red-500 text-sm">{{ errorMsg }}</p>

        <button type="submit" class="w-full bg-black text-white p-2 rounded">
          {{ isLogin ? "Login" : "Register" }}
        </button>
      </form>

      <button
        @click="isLogin = !isLogin"
        class="w-full text-sm text-gray-500 underline"
      >
        {{ isLogin ? "No account? Create" : "Already have an account? Login" }}
      </button>
    </div>
  </div>
</template>
