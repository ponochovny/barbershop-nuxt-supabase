<script lang="ts" setup>
import type { Database } from "~~/types/database.types";

const bookings = ref<any[]>([]); // Ideally, write the exact interface with JOIN here, leaving any for speed

const supabase = useSupabaseClient<Database>();

async function fetchBookings() {
  const { data } = await supabase
    .from("bookings")
    .select(
      `
      id, 
      start_time, 
      status,
      service:services (name, duration_minutes)
    `,
    )
    .order("start_time", { ascending: false });

  if (data) bookings.value = data;
}

onMounted(() => {
  fetchBookings();
});
</script>
<template>
  <div class="mb-10">
    <div>
      <h2>Admin panel</h2>
    </div>
    <div>
      <h2>Bookings:</h2>
      <div v-if="bookings?.length === 0" class="text-gray-500">
        No bookings yet.
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="b in bookings"
          :key="b.id"
          class="border p-4 rounded-lg flex justify-between items-center"
          :class="{ 'opacity-60 bg-gray-50': b.status === 'cancelled' }"
        >
          <div>
            <div class="font-medium text-lg">{{ b.service?.name }}</div>
            <div class="text-sm text-gray-600">
              {{ new Date(b.start_time).toLocaleString("ru-RU") }}
            </div>
            <div class="mt-1">
              <span
                v-if="b.status === 'pending'"
                class="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded"
                >Pending</span
              >
              <span
                v-if="b.status === 'confirmed'"
                class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded"
                >Confirmed</span
              >
              <span
                v-if="b.status === 'cancelled'"
                class="text-xs bg-red-100 text-red-800 px-2 py-1 rounded"
                >Cancelled</span
              >
            </div>
          </div>

          <!-- Cancel button visible only for pending status -->
          <!-- <button
          v-if="b.status === 'pending'"
          @click="cancelBooking(b.id)"
          class="text-sm text-red-600 border border-red-200 px-3 py-1 rounded hover:bg-red-50 transition"
        >
          Cancel
        </button> -->
        </div>
      </div>
    </div>
  </div>
</template>
