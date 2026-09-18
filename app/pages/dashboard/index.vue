<script setup lang="ts">
import { toast } from 'vue-sonner'
import type { Database } from '~~/types/database.types'
import type { BookingWithService } from '~~/types'

const supabase = useSupabaseClient<Database>()
const user = useSupabaseUser()

// States
const services = ref<Database['public']['Tables']['services']['Row'][]>([])
const myBookings = ref<BookingWithService[]>([])

// New booking form
const form = ref({
	serviceId: '',
	date: '',
	time: '10:00',
})

// Available time slots (simplified)
const timeSlots = [
	'10:00',
	'11:00',
	'12:00',
	'14:00',
	'15:00',
	'16:00',
	'17:00',
]

const serviceImage = (name: string) => {
	return (
		{
			'Classic Haircut':
				'https://images.squarespace-cdn.com/content/v1/5bc91be24d87116f3a90363b/1578698382919-PDRL2SQBOS2GFCMSE088/image.jpg',
			'Beard Shaping':
				'https://cdn.prod.website-files.com/5cb569e54ca2fddd5451cbb2/64261d87fab1f4ea78ef1621_Beard.jpg',
			'Package (Haircut + Beard)':
				'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=688&auto=format&fit=crop',
			"Children's Haircut":
				'https://cdn.motherhood.com.my/wp-content/uploads/2022/10/05160011/Short-Textured-Haircut-with-Low-Taper-Fade.jpg',
		}[name] || 'https://placehold.co/800x500/e7eee8/18201e?text=North+Blade'
	)
}

const formatBookingDate = (value: string) =>
	new Date(value).toLocaleString('en-US', {
		weekday: 'short',
		month: 'short',
		day: 'numeric',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	})

const isExpired = (value: string) => new Date(value).getTime() <= Date.now()
const canCancel = (booking: BookingWithService) =>
	booking.status === 'pending' && !isExpired(booking.start_time)

// Get list of services
async function fetchServices() {
	const { data } = await supabase.from('services').select('*')
	if (data) services.value = data
}

// Get bookings of current client
async function fetchMyBookings() {
	const { data } = await supabase
		.from('bookings')
		.select(
			`
      id, 
      start_time, 
      status,
      service:services (name, duration_minutes)
    `,
		)
		.eq('user_id', user.value!.sub)
		.order('start_time', { ascending: false })

	if (data) myBookings.value = data
}

// Create booking
async function createBooking() {
	if (!form.value.serviceId || !form.value.date)
		return toast.error('Please fill in all fields', {
			description: 'Please fill in all fields',
		})

	// Combine date and time into ISO 8601 format (TIMESTAMPTZ for database)
	const dateTimeString = `${form.value.date}T${form.value.time}:00`
	const startTime = new Date(dateTimeString).toISOString()

	const { error } = await supabase.from('bookings').insert({
		user_id: user.value!.sub,
		service_id: form.value.serviceId,
		start_time: startTime,
		status: 'pending', // Default status
	})

	if (error) {
		toast.error('Error creating booking', {
			description: 'Error creating booking: ' + error.message,
		})
	} else {
		toast.success('Booking created successfully!', {
			description: 'Booking created successfully!',
		})
		form.value.date = '' // clear form
		fetchMyBookings() // update list
	}
}

// Cancel booking
async function cancelBooking(bookingId: string) {
	if (!confirm('Are you sure you want to cancel the booking?')) return

	// Our RLS policy allows this action only if the status is 'pending'
	const { error } = await supabase
		.from('bookings')
		.update({ status: 'cancelled' })
		.eq('id', bookingId)

	if (error) {
		toast.error('Error cancelling booking', {
			description: 'Error cancelling booking: ' + error.message,
		})
	} else {
		toast.success('Booking cancelled successfully!', {
			description: 'Booking cancelled successfully!',
		})
		fetchMyBookings()
	}
}

const logout = async () => {
	await supabase.auth.signOut()
	navigateTo('/login')
}

onMounted(() => {
	fetchServices()
	fetchMyBookings()
})
</script>

<template>
	<div class="min-h-screen bg-gray-50 p-8">
		<div class="max-w-5xl mx-auto">
			<div class="mb-8 flex items-end justify-between gap-4">
				<div>
					<p
						class="mb-2 text-xs font-extrabold uppercase tracking-[0.18em] text-[#b55b3e]"
					>
						Your space
					</p>
					<h1 class="m-0 text-3xl font-bold text-[#18201e]">
						Personal account
					</h1>
				</div>
				<button
					@click="logout"
					class="inline-flex items-center gap-2 border border-[#e7c5b7] bg-[#fff8f5] px-4 py-2 text-xs font-extrabold uppercase tracking-wide text-[#9b4b35] transition hover:border-[#b55b3e] hover:bg-[#b55b3e] hover:text-white"
				>
					<Icon name="lucide:log-out" class="size-4" aria-hidden="true" />
					Log out
				</button>
			</div>

			<div
				class="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(22rem,0.9fr)_minmax(0,1.4fr)]"
			>
				<section
					class="rounded-xl border border-[#dfe7e1] bg-white p-5 shadow-[0_1rem_3rem_rgba(24,32,30,0.06)] sm:p-6"
				>
					<div class="mb-5 flex items-start justify-between gap-4">
						<div>
							<p
								class="mb-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#b55b3e]"
							>
								Step 01
							</p>
							<h2 class="m-0 text-xl font-semibold text-[#18201e]">
								New booking
							</h2>
						</div>
						<Icon
							name="lucide:calendar-plus-2"
							class="size-5 text-[#b55b3e]"
							aria-hidden="true"
						/>
					</div>

					<form @submit.prevent="createBooking" class="space-y-5">
						<fieldset>
							<legend class="mb-3 text-sm font-semibold text-[#53615b]">
								Choose a service
							</legend>
							<div class="grid grid-cols-2 gap-2">
								<label
									v-for="service in services"
									:key="service.id"
									:class="
										form.serviceId === service.id
											? 'border-[#b55b3e] ring-2 ring-[#e9a98d]/50'
											: 'border-[#e1e6e1] hover:border-[#b9c0ba]'
									"
									class="group relative cursor-pointer overflow-hidden border bg-[#f7faf7] transition"
								>
									<input
										v-model="form.serviceId"
										type="radio"
										:value="service.id"
										class="sr-only"
										required
									/>
									<NuxtImg
										:src="serviceImage(service.name)"
										:alt="service.name"
										width="320"
										height="190"
										format="webp"
										class="h-20 w-full object-cover saturate-[.72] transition group-hover:scale-105"
									/>
									<span class="block p-2">
										<span
											class="block truncate text-xs font-bold text-[#18201e]"
											>{{ service.name }}</span
										>
										<span
											class="mt-1 flex items-center justify-between text-[10px] text-[#89928d]"
											><span>{{ service.duration_minutes }} min</span
											><strong class="text-[#b55b3e]"
												>{{ service.price }} ₴</strong
											></span
										>
									</span>
									<Icon
										v-if="form.serviceId === service.id"
										name="lucide:circle-check"
										class="absolute right-2 top-2 size-4 rounded-full bg-white text-[#b55b3e]"
										aria-hidden="true"
									/>
								</label>
							</div>
						</fieldset>

						<div class="grid grid-cols-2 gap-3">
							<label
								for="date"
								class="block text-sm font-semibold text-[#53615b]"
							>
								Date
								<input
									type="date"
									v-model="form.date"
									id="date"
									class="mt-2 w-full rounded border border-[#dfe7e1] bg-[#f7faf7] p-2.5 text-sm outline-none focus:border-[#b55b3e]"
									required
								/>
							</label>
							<label
								for="time"
								class="block text-sm font-semibold text-[#53615b]"
							>
								Time
								<select
									v-model="form.time"
									id="time"
									class="mt-2 w-full rounded border border-[#dfe7e1] bg-[#f7faf7] p-2.5 text-sm outline-none focus:border-[#b55b3e]"
									required
								>
									<option v-for="t in timeSlots" :key="t" :value="t">
										{{ t }}
									</option>
								</select>
							</label>
						</div>

						<Button type="submit" class="w-full" size="lg"
							><Icon
								name="lucide:calendar-check-2"
								class="size-4"
								aria-hidden="true"
							/>
							Confirm booking
						</Button>
					</form>
				</section>

				<section
					class="min-w-0 rounded-xl border border-[#dfe7e1] bg-white p-5 shadow-[0_1rem_3rem_rgba(24,32,30,0.06)] sm:p-6"
				>
					<div class="mb-5 flex items-center justify-between gap-4">
						<div>
							<p
								class="mb-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#b55b3e]"
							>
								Your schedule
							</p>
							<h2 class="m-0 text-xl font-semibold text-[#18201e]">
								My bookings
							</h2>
						</div>
						<Icon
							name="lucide:calendar-days"
							class="size-5 text-[#b55b3e]"
							aria-hidden="true"
						/>
					</div>

					<div
						v-if="myBookings.length === 0"
						class="border border-dashed border-[#dfe7e1] p-8 text-center text-sm text-[#89928d]"
					>
						No bookings yet.
					</div>

					<div v-else class="grid gap-3">
						<div
							v-for="b in myBookings"
							:key="b.id"
							class="flex items-center justify-between gap-4 border border-[#e1e6e1] p-4"
							:class="{ 'opacity-60 bg-gray-50': b.status === 'cancelled' }"
						>
							<div>
								<div class="font-medium text-lg text-[#18201e]">
									{{ b.service?.name }}
								</div>
								<div
									class="mt-1 flex items-center gap-1 text-sm text-[#69736d]"
								>
									<Icon
										name="lucide:clock-3"
										class="size-4 text-[#b55b3e]"
										aria-hidden="true"
									/>
									{{ formatBookingDate(b.start_time) }}
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
								v-if="canCancel(b)"
								@click="cancelBooking(b.id)"
								class="inline-flex items-center gap-1 border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
							>
								<Icon name="lucide:x" class="size-3.5" aria-hidden="true" />
								Cancel
							</button>
							<span
								v-else-if="b.status === 'pending' && isExpired(b.start_time)"
								class="text-right text-[10px] font-semibold uppercase tracking-wide text-[#9b4b35]"
								>Expired</span
							>
						</div>
					</div>
				</section>
			</div>
		</div>
	</div>
</template>
