import type { Database } from "~~/types/database.types";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const user = useSupabaseUser();

  // If the user is not authorized, the supabase module will redirect him to /login (according to nuxt.config.ts)
  if (!user.value) return;

  // We check the roles ONLY if the user is trying to enter the admin panel
  if (to.path.startsWith("/admin")) {
    const supabase = useSupabaseClient<Database>();

    // Get the profile of the current user
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.value.sub)
      .single();

    // If the profile is not found or the role is not admin, redirect to the client's cabinet
    if (!profile || profile.role !== "admin") {
      return navigateTo("/dashboard");
    }
  }
});
