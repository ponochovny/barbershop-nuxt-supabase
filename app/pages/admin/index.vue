<script lang="ts" setup>
import type { Database } from "~~/types/database.types";

const supabase = useSupabaseClient<Database>();

const { data: bookings } = await supabase.from("bookings").select("*");
</script>
<template>
  <div>
    <h2>Admin panel</h2>
  </div>
  <div>
    <h2>Bookings:</h2>
    <ul>
      <li v-for="booking in bookings" :key="booking.id">
        {{ booking.id }} || {{ booking.service_id }} || {{ booking.user_id }} ||
        {{ booking.start_time }} || {{ booking.status }}
      </li>
    </ul>
  </div>
</template>
