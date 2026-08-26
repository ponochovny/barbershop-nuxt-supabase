<script lang="ts" setup>
import Header from "~/widgets/header.vue";
import "vue-sonner/style.css";
</script>

<template>
  <Header />
  <div class="container mx-auto mt-20">
    <slot />
  </div>
  <Toaster position="bottom-center" richColors />
</template>
