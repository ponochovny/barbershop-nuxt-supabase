<script lang="ts" setup>
import type { Database } from "~~/types/database.types";

const user = useSupabaseUser();
const supabase = useSupabaseClient<Database>();

const { data: bookings } = await supabase.from("bookings").select("*");
</script>
<template>
  <div>
    <h1>Dashboard</h1>
    <p>User: {{ user?.email }}</p>
    <button @click="supabase.auth.signOut()">Logout</button>
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
