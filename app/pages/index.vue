<script lang="ts" setup>
import ServicesList from '~/widgets/services-list.vue'
import type { Database } from '~~/types/database.types'

const supabase = useSupabaseClient<Database>()
const user = useSupabaseUser()
type Service = Database['public']['Tables']['services']['Row']

const services = ref<Service[]>([])
const servicesError = ref<string | null>(null)
const servicesLoading = ref(false)
let servicesRequestGeneration = 0

async function fetchServices() {
	if (servicesLoading.value) return

	const requestGeneration = ++servicesRequestGeneration
	servicesLoading.value = true

	try {
		const { data, error } = await supabase.from('services').select('*')

		if (requestGeneration !== servicesRequestGeneration) return

		if (error) {
			servicesError.value = error.message
			services.value = []
			return
		}

		servicesError.value = null
		services.value = data ?? []
	} finally {
		if (requestGeneration === servicesRequestGeneration) {
			servicesLoading.value = false
		}
	}
}

await fetchServices()

useSeoMeta({
	title: () => 'Home',
	ogTitle: () => 'Home - North Blade Barbershop',
	description: () =>
		'North Blade Barbershop offers expert haircuts and beard care. Book your appointment online and experience top-notch grooming services.',
})
</script>

<template>
	<div class="text-[#18201e]">
		<section
			class="grid items-center gap-12 py-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(420px,1.1fr)] lg:gap-20 lg:py-16"
		>
			<div class="lg:pl-[clamp(0rem,4vw,4.5rem)]">
				<p
					class="mb-5 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#b55b3e]"
				>
					CITY BARBERSHOP / EST. 2014
				</p>
				<h1
					class="font-serif text-[clamp(3.4rem,6vw,6.5rem)] font-normal leading-[0.92] tracking-[-0.06em]"
				>
					Your style.<br />
					<span class="italic text-[#b55b3e]">Your time.</span>
				</h1>
				<p class="my-8 max-w-md text-base leading-7 text-[#69736d]">
					Haircuts, beard care, and that confident feeling after the chair.
					Choose a service and book your preferred time in a minute.
				</p>
				<div class="flex flex-wrap items-center gap-6">
					<NuxtLink
						:to="user ? '/dashboard' : '/login'"
						class="inline-flex items-center gap-5 bg-[#18201e] px-5 py-4 text-xs font-extrabold uppercase tracking-[0.06em] text-white transition hover:-translate-y-0.5 hover:bg-[#b55b3e]"
					>
						Book now
						<Icon
							name="lucide:arrow-up-right"
							class="size-4 text-[#e9a98d]"
							aria-hidden="true"
						/>
					</NuxtLink>
					<a
						href="#services"
						class="border-b border-[#b9c0ba] pb-1 text-xs font-bold text-[#53615b]"
						>View services</a
					>
				</div>
				<div
					class="mt-14 flex flex-wrap items-center gap-4 text-lg text-[#89928d]"
				>
					<span> <strong>4.9</strong> client rating</span>
					<span class="h-5 w-px bg-[#d3d8d3]" aria-hidden="true"> </span>
					<span>Mon–Sun <strong>10:00–20:00</strong> </span>
				</div>
			</div>
			<div
				class="relative min-h-88 py-4 pr-0 sm:min-h-104 lg:min-h-132 lg:pr-6"
				aria-label="Barbershop interior"
			>
				<div
					class="relative h-full min-h-84 overflow-hidden [clip-path:polygon(8%_0,100%_0,100%_91%,92%_100%,0_100%,0_9%)] sm:min-h-100 lg:min-h-124"
				>
					<NuxtImg
						src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1200&q=85"
						alt="Barber at work"
						width="1200"
						height="900"
						format="webp"
						class="h-full w-full object-cover opacity-90 saturate-[.78]"
					/>
					<div
						class="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-[#0c1512]/85"
					></div>
					<div class="absolute bottom-8 left-9 z-1 text-white">
						<span
							class="mb-3 block text-[10px] uppercase tracking-[0.16em] text-[#e9a98d]"
							>01 / atmosphere</span
						>
						<strong class="font-serif text-[1.65rem] font-normal leading-tight"
							>A chair you<br />will want to stay in</strong
						>
					</div>
				</div>
				<div
					class="absolute top-6 left-3 z-2 -rotate-3 bg-[#e9a98d] px-4 py-3 text-[11px] font-extrabold text-[#18201e] sm:-left-8"
				>
					<Icon
						name="lucide:sparkles"
						class="mr-1 inline size-4"
						aria-hidden="true"
					/>
					Your new care ritual
				</div>
				<div
					class="absolute right-0 top-0 font-serif text-lg text-[#d4d9d4] [writing-mode:vertical-rl]"
				>
					#08
				</div>
			</div>
		</section>

		<section
			class="grid border-y border-[#dce1dc] py-5 md:grid-cols-3"
			aria-label="Benefits"
		>
			<div
				class="grid grid-cols-[2.6rem_1fr] gap-x-3 border-b border-[#dce1dc] py-3 md:border-b-0 md:border-r md:px-8 md:first:pl-0"
			>
				<span
					class="row-span-2 flex h-9 w-9 items-center justify-center rounded-full bg-[#e7eee8] text-[#b55b3e]"
				>
					<Icon name="lucide:scissors" class="size-4" aria-hidden="true" />
				</span>
				<strong class="text-2xl">Experienced barbers</strong>
				<small class="text-sm text-[#87918b]">We know what suits you</small>
			</div>
			<div
				class="grid grid-cols-[2.6rem_1fr] gap-x-3 border-b border-[#dce1dc] py-3 md:border-b-0 md:border-r md:px-8"
			>
				<span
					class="row-span-2 flex h-9 w-9 items-center justify-center rounded-full bg-[#e7eee8] text-[#b55b3e]"
				>
					<Icon name="lucide:clock-3" class="size-4" aria-hidden="true" />
				</span>
				<strong class="text-2xl">No waiting</strong>
				<small class="text-sm text-[#87918b]">Arrive exactly on time</small>
			</div>
			<div
				class="grid grid-cols-[2.6rem_1fr] gap-x-3 py-3 md:px-8 md:last:pr-0"
			>
				<span
					class="row-span-2 flex h-9 w-9 items-center justify-center rounded-full bg-[#e7eee8] text-[#b55b3e]"
				>
					<Icon
						name="lucide:calendar-check-2"
						class="size-4"
						aria-hidden="true"
					/>
				</span>
				<strong class="text-2xl">Easy online booking</strong>
				<small class="text-sm text-[#87918b]">Book in a few clicks, 24/7</small>
			</div>
		</section>

		<section id="services" class="pt-20 lg:pt-28">
			<div
				class="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end"
			>
				<div>
					<p
						class="mb-5 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#b55b3e]"
					>
						WHAT WE DO
					</p>
					<h2
						class="font-serif text-[clamp(2.6rem,4vw,4.4rem)] font-normal leading-[0.95] tracking-tighter"
					>
						Choose your<br />
						<em class="italic text-[#b55b3e]">best look.</em>
					</h2>
				</div>
				<p
					class="mb-1 text-left text-xs leading-6 text-[#89928d] md:text-right"
				>
					No unnecessary moves.<br />Only what works.
				</p>
			</div>
			<div
				v-if="servicesError"
				class="flex flex-col items-start gap-4 border border-[#e7c5b7] bg-[#fff8f5] p-6 text-[#8d4935]"
			>
				<div class="flex items-center gap-2 font-semibold">
					<Icon name="lucide:circle-alert" class="size-5" aria-hidden="true" />
					<span>We couldn't load the services.</span>
				</div>
				<p class="m-0 text-sm text-[#9d6d5e]">
					Please check your connection and try again.
				</p>
				<button
					type="button"
					:disabled="servicesLoading"
					class="inline-flex items-center gap-2 bg-[#18201e] px-4 py-2 text-xs font-extrabold uppercase tracking-wide text-white transition hover:bg-[#b55b3e] disabled:cursor-not-allowed disabled:opacity-60"
					@click="fetchServices"
				>
					<Icon
						name="lucide:refresh-cw"
						class="size-4"
						:class="{ 'animate-spin': servicesLoading }"
						aria-hidden="true"
					/>
					{{ servicesLoading ? 'Retrying...' : 'Retry' }}
				</button>
			</div>
			<ServicesList v-else :services="services" />
		</section>
	</div>
</template>
