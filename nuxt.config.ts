// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxtjs/supabase", "@nuxtjs/tailwindcss", "shadcn-nuxt", "@nuxt/icon"],
  supabase: {
    redirectOptions: {
      login: "/login",
      callback: "/confirm",
      exclude: ["/", "/register", "/about", "/blog/*"], // Add public routes here
    },
  },
  css: ["~/assets/css/tailwind.css"],
  shadcn: {
    componentDir: "@/shared/ui",
    prefix: "",
  },
});
