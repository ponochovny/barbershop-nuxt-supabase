<script setup lang="ts">
import { toast } from "vue-sonner";
import type { Database } from "~~/types/database.types";
import type { BookingWithService } from "~~/types";

const supabase = useSupabaseClient<Database>();
const user = useSupabaseUser();

// States
const services = ref<Database["public"]["Tables"]["services"]["Row"][]>([]);
const myBookings = ref<BookingWithService[]>([]);

// New booking form
const form = ref({
  serviceId: "",
  date: "",
  time: "10:00",
});

// Available time slots (simplified)
const timeSlots = [
  "10:00",
  "11:00",
  "12:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

// Get list of services
async function fetchServices() {
  const { data } = await supabase.from("services").select("*");
  if (data) services.value = data;
}

// Get bookings of current client
async function fetchMyBookings() {
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
    .eq("user_id", user.value!.sub)
    .order("start_time", { ascending: false });

  if (data) myBookings.value = data;
}

// Create booking
async function createBooking() {
  if (!form.value.serviceId || !form.value.date)
    return toast.error("Please fill in all fields", {
      description: "Please fill in all fields",
    });

  // Combine date and time into ISO 8601 format (TIMESTAMPTZ for database)
  const dateTimeString = `${form.value.date}T${form.value.time}:00`;
  const startTime = new Date(dateTimeString).toISOString();

  const { error } = await supabase.from("bookings").insert({
    user_id: user.value!.sub,
    service_id: form.value.serviceId,
    start_time: startTime,
    status: "pending", // По умолчанию
  });

  if (error) {
    toast.error("Error creating booking", {
      description: "Error creating booking: " + error.message,
    });
  } else {
    toast.success("Booking created successfully!", {
      description: "Booking created successfully!",
    });
    form.value.date = ""; // clear form
    fetchMyBookings(); // update list
  }
}

// Cancel booking
async function cancelBooking(bookingId: string) {
  if (!confirm("Are you sure you want to cancel the booking?")) return;

  // Our RLS policy allows this action only if the status is 'pending'
  const { error } = await supabase
    .from("bookings")
    .update({ status: "cancelled" })
    .eq("id", bookingId);

  if (error) {
    toast.error("Error cancelling booking", {
      description: "Error cancelling booking: " + error.message,
    });
  } else {
    toast.success("Booking cancelled successfully!", {
      description: "Booking cancelled successfully!",
    });
    fetchMyBookings();
  }
}

const logout = async () => {
  await supabase.auth.signOut();
  navigateTo("/login");
};

onMounted(() => {
  fetchServices();
  fetchMyBookings();
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="max-w-5xl mx-auto">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold">Personal account</h1>
        <button @click="logout" class="text-red-600 hover:underline">
          Log out
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Left column: Form -->
        <div
          class="md:col-span-1 bg-white p-6 rounded-lg shadow-sm border border-gray-100"
        >
          <h2 class="text-xl font-semibold mb-4">New booking</h2>

          <form @submit.prevent="createBooking" class="space-y-4">
            <div>
              <label for="service" class="block text-sm text-gray-600 mb-1"
                >Service</label
              >
              <select
                v-model="form.serviceId"
                id="service"
                class="w-full border p-2 rounded"
                required
              >
                <option disabled value="">Select a service...</option>
                <option v-for="s in services" :key="s.id" :value="s.id">
                  {{ s.name }} ({{ s.price }} ₴)
                </option>
              </select>
            </div>

            <div>
              <label for="date" class="block text-sm text-gray-600 mb-1"
                >Date</label
              >
              <input
                type="date"
                v-model="form.date"
                id="date"
                class="w-full border p-2 rounded"
                required
              />
            </div>

            <div>
              <label for="time" class="block text-sm text-gray-600 mb-1"
                >Time</label
              >
              <select
                v-model="form.time"
                id="time"
                class="w-full border p-2 rounded"
                required
              >
                <option v-for="t in timeSlots" :key="t" :value="t">
                  {{ t }}
                </option>
              </select>
            </div>

            <Button type="submit" class="w-full" size="lg"> Book </Button>
          </form>
        </div>

        <!-- Right column: My bookings -->
        <div
          class="md:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-100"
        >
          <h2 class="text-xl font-semibold mb-4">My bookings</h2>

          <div v-if="myBookings.length === 0" class="text-gray-500">
            No bookings yet.
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="b in myBookings"
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
              <button
                v-if="b.status === 'pending'"
                @click="cancelBooking(b.id)"
                class="text-sm text-red-600 border border-red-200 px-3 py-1 rounded hover:bg-red-50 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
