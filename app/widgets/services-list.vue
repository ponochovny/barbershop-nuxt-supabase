<script lang="ts" setup>
import type { Database } from '~~/types/database.types'

type service = Database['public']['Tables']['services']['Row']
const user = useSupabaseUser()

interface Props {
	services: service[] | null
}

defineProps<Props>()

const fallbackServiceImage =
	'https://placehold.co/800x800/e7eee8/18201e?text=North+Blade'

const serviceImage = (name: string) => {
	return (
		{
			'Classic Haircut':
				'https://images.squarespace-cdn.com/content/v1/5bc91be24d87116f3a90363b/1578698382919-PDRL2SQBOS2GFCMSE088/image.jpg',
			'Beard Shaping':
				'https://cdn.prod.website-files.com/5cb569e54ca2fddd5451cbb2/64261d87fab1f4ea78ef1621_Beard.jpg',
			'Package (Haircut + Beard)':
				'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
			"Children's Haircut":
				'https://cdn.motherhood.com.my/wp-content/uploads/2022/10/05160011/Short-Textured-Haircut-with-Low-Taper-Fade.jpg',
		}[name] || fallbackServiceImage
	)
}
</script>

<template>
	<div
		v-if="services?.length"
		class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
	>
		<div
			v-for="service in services"
			:key="service.id"
			class="border border-[#e1e6e1] bg-white transition hover:-translate-y-1 hover:shadow-[0_1.25rem_2.5rem_rgba(24,32,30,0.1)]"
		>
			<div
				class="relative aspect-[1.7/1] overflow-hidden bg-[#d9e2dc] sm:aspect-square"
			>
				<img
					:src="serviceImage(service.name)"
					:alt="service.name"
					class="h-full w-full object-cover saturate-[.72]"
				/>
				<span
					class="absolute left-3 top-3 bg-white px-2 py-1 text-[10px] font-extrabold text-[#b55b3e]"
					>0{{ services.indexOf(service) + 1 }}</span
				>
			</div>
			<div class="p-5">
				<div class="flex items-start justify-between gap-2">
					<h3
						class="font-serif text-xl font-normal leading-tight text-[#18201e]"
					>
						{{ service.name }}
					</h3>
					<strong class="whitespace-nowrap text-sm text-[#b55b3e]"
						>{{ service.price }} ₴</strong
					>
				</div>
				<p class="my-3 min-h-[2.2rem] text-xs leading-5 text-[#89928d]">
					{{ service.description || 'Precise work and attention to detail.' }}
				</p>
				<div
					class="flex items-center justify-between border-t border-[#e6eae6] pt-3 text-[10px] text-[#89928d]"
				>
					<span class="inline-flex items-center gap-1"
						><Icon name="lucide:clock-3" class="size-3.5" aria-hidden="true" />
						{{ service.duration_minutes }} min</span
					>
					<NuxtLink
						:to="user ? '/dashboard' : '/login'"
						class="text-[11px] font-extrabold uppercase text-[#18201e]"
						>Book now
						<Icon
							name="lucide:arrow-up-right"
							class="ml-1 inline size-4 text-[#b55b3e]"
							aria-hidden="true"
					/></NuxtLink>
				</div>
			</div>
		</div>
	</div>
	<p v-else class="text-[#89928d]">No services available yet.</p>
</template>
