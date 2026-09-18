// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxtjs/supabase", "@nuxtjs/tailwindcss", "shadcn-nuxt", "@nuxt/icon", "@nuxt/image"],
  image: {
    domains: [
      'images.unsplash.com',
      'images.squarespace-cdn.com',
      'cdn.prod.website-files.com',
      'cdn.motherhood.com.my',
      'placehold.co',
    ],
  },
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

  app: {
    head: {
      title: 'Home | North Blade',
      titleTemplate: '%s · North Blade',
      link: [
        {
          rel: 'apple-touch-icon',
          sizes: '180x180',
          href: '/apple-touch-icon.png'
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '32x32',
          href: '/favicon-32x32.png'
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '16x16',
          href: '/favicon-16x16.png'
        },
        { rel: 'manifest', href: '/site.webmanifest' }
      ]
    }
  }
});
