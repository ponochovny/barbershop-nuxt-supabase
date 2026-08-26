<script lang="ts" setup>
import type { Database } from "~~/types/database.types";

type service = Database["public"]["Tables"]["services"]["Row"];

interface Props {
  services: service[] | null;
}

defineProps<Props>();
</script>

<template>
  <div>
    <h2>Services:</h2>
    <ul v-if="services?.length">
      <li v-for="service in services" :key="service.id">
        {{ service.name }} - {{ service.price }}
      </li>
    </ul>
    <p v-else class="italic text-muted-foreground">No services found</p>
  </div>
</template>
