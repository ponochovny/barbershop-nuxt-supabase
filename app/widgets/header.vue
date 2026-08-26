<script lang="ts" setup></script>
<template>
  <header class="fixed top-0 left-0 w-full bg-background z-10">
    <div class="container mx-auto flex justify-between py-4">
      <nav class="flex items-center gap-4">
        <Button variant="secondary" as-child class="no-underline">
          <nuxt-link to="/">Barbershop</nuxt-link>
        </Button>
        <ul class="flex gap-4">
          <li>
            <Button variant="outline" as-child class="no-underline">
              <nuxt-link to="/dashboard">Dashboard</nuxt-link>
            </Button>
          </li>
          <li>
            <Button variant="outline" as-child class="no-underline">
              <nuxt-link to="/admin">Admin</nuxt-link>
            </Button>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>
