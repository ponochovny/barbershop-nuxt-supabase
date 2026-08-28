<script setup lang="ts">
import { toast } from "vue-sonner";
import type { Database } from "~~/types/database.types";

const supabase = useSupabaseClient<Database>();
const bookings = ref<any[]>([]);

// Get all bookings (only admin can see thanks to RLS)
async function fetchAllBookings() {
  const { data, error } = await supabase
    .from("bookings")
    .select(
      `
      id, 
      start_time, 
      status,
      service:services (name, price),
      user:profiles (full_name, id)
    `,
    )
    .order("start_time", { ascending: true });

  if (error) {
    console.error("Error loading records:", error);
    return;
  }

  if (data) bookings.value = data;
}

// Update booking status
async function updateBookingStatus(
  id: string,
  newStatus: "confirmed" | "cancelled",
) {
  const { error } = await supabase
    .from("bookings")
    .update({ status: newStatus })
    .eq("id", id);

  if (error) {
    toast.error("Error updating status: " + error.message);
    return;
  }

  toast.success("Status updated successfully");
  // No need to call fetchAllBookings() manually, as Realtime subscription will work!
}

// Realtime setup
let realtimeChannel: any;

onMounted(() => {
  fetchAllBookings();

  // subscribe to changes in the bookings table
  realtimeChannel = supabase
    .channel("admin-bookings-channel")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "bookings" },
      (payload) => {
        console.log("Realtime update received!", payload);
        // with any changes (create, update status, delete) just request the list again
        fetchAllBookings();
      },
    )
    .subscribe();
});

onUnmounted(() => {
  // unsubscribe from the channel when leaving the page to avoid creating extra connections
  if (realtimeChannel) supabase.removeChannel(realtimeChannel);
});
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-8">
    <div class="max-w-7xl mx-auto">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Admin Panel</h1>
        <NuxtLink to="/dashboard" class="text-gray-600 hover:underline"
          >Back to Dashboard</NuxtLink
        >
      </div>

      <div class="bg-white rounded-lg shadow overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Date and Time
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Customer
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Service
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="bookings.length === 0">
              <td
                colspan="5"
                class="px-6 py-4 text-center text-sm text-gray-500"
              >
                There are no records yet
              </td>
            </tr>
            <tr
              v-for="b in bookings"
              :key="b.id"
              :class="{
                'bg-red-50': b.status === 'cancelled',
                'bg-green-50': b.status === 'confirmed',
              }"
            >
              <td
                class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
              >
                {{
                  new Date(b.start_time).toLocaleString("ru-RU", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ b.user?.full_name || "Неизвестный" }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ b.service?.name }} <br />
                <span class="text-xs text-gray-400"
                  >{{ b.service?.price }} ₴</span
                >
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  v-if="b.status === 'pending'"
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800"
                  >Pending</span
                >
                <span
                  v-if="b.status === 'confirmed'"
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800"
                  >Confirmed</span
                >
                <span
                  v-if="b.status === 'cancelled'"
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800"
                  >Cancelled</span
                >
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2"
              >
                <template v-if="b.status === 'pending'">
                  <button
                    @click="updateBookingStatus(b.id, 'confirmed')"
                    class="text-green-600 hover:text-green-900 bg-green-50 px-3 py-1 rounded border border-green-200"
                  >
                    Confirmed
                  </button>
                  <button
                    @click="updateBookingStatus(b.id, 'cancelled')"
                    class="text-red-600 hover:text-red-900 bg-red-50 px-3 py-1 rounded border border-red-200"
                  >
                    Cancelled
                  </button>
                </template>
                <template v-else>
                  <span class="text-gray-400 text-xs">No actions</span>
                </template>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
