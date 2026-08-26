<script lang="ts" setup>
import type { Database } from "~~/types/database.types";

type Booking = Database["public"]["Tables"]["bookings"]["Row"];

interface Props {
  bookings: Booking[] | null;
}

defineProps<Props>();
</script>

<template>
  <div>
    <h2>Bookings:</h2>
    <ul v-if="bookings?.length">
      <li v-for="booking in bookings" :key="booking.id">
        {{ booking.id }} || {{ booking.service_id }} || {{ booking.user_id }} ||
        {{ booking.start_time }} ||
        {{ booking.status }}
      </li>
    </ul>
    <p v-else class="italic text-muted-foreground">No bookings found</p>
  </div>
</template>
