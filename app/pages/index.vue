<script lang="ts" setup>
import type { Database } from "~~/types/database.types";

// Anywhere in the project:
const supabase = useSupabaseClient<Database>();

// Now when you write a query, you will have 100% autocomplete:
const { data: bookings } = await supabase.from("bookings").select("*");
const { data: services } = await supabase.from("services").select("*");
</script>

<template>
  <div>
    <h2>Bookings:</h2>
    <ul>
      <li v-for="booking in bookings" :key="booking.id">
        {{ booking.id }} || {{ booking.service_id }} || {{ booking.user_id }} ||
        {{ booking.start_time }} || {{ booking.status }}
      </li>
    </ul>
    <h2>Services:</h2>
    <ul>
      <li v-for="service in services" :key="service.id">
        {{ service.name }} - {{ service.price }}
      </li>
    </ul>
  </div>
</template>
