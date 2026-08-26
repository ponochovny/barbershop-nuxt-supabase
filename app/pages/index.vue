<script lang="ts" setup>
import ServicesList from "~/widgets/services-list.vue";
import type { Database } from "~~/types/database.types";

// Anywhere in the project:
const supabase = useSupabaseClient<Database>();

// Now when you write a query, you will have 100% autocomplete:
const { data: services } = await supabase.from("services").select("*");
</script>

<template>
  <div>
    <ServicesList :services="services" class="mt-8" />
  </div>
</template>
