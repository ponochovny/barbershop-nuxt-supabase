<script lang="ts" setup>
import BookingsList from "~/widgets/bookings-list.vue";
import type { Database } from "~~/types/database.types";

const user = useSupabaseUser();
const supabase = useSupabaseClient<Database>();

const { data: bookings } = await supabase.from("bookings").select("*");
</script>
<template>
  <div>
    <h1>Dashboard</h1>
    <p>User: {{ user?.email }}</p>
    <Button variant="outline" @click="supabase.auth.signOut()">Logout</Button>
  </div>
  <BookingsList :bookings="bookings" class="mt-8" />
</template>
