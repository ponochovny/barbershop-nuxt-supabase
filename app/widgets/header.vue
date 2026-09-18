<script lang="ts" setup>
import type { Database } from '~~/types/database.types'

const user = useSupabaseUser()
const supabase = useSupabaseClient<Database>()
const isAdmin = ref(false)
let roleRequestGeneration = 0

async function loadRole() {
	const requestGeneration = ++roleRequestGeneration
	const userId = user.value?.sub
	isAdmin.value = false
	if (!userId) return

	const { data: profile } = await supabase
		.from('profiles')
		.select('role')
		.eq('id', userId)
		.maybeSingle()

	if (
		requestGeneration !== roleRequestGeneration ||
		user.value?.sub !== userId
	) {
		return
	}

	isAdmin.value = profile?.role === 'admin'
}

watch(user, loadRole, { immediate: true })
</script>

<template>
	<header
		class="fixed left-0 top-0 z-10 w-full border-b border-[#e1e6e1] bg-[#f6f8f5]/90 backdrop-blur-xl"
	>
		<div
			class="mx-auto flex min-h-[4.7rem] max-w-7xl items-center justify-between px-5 lg:px-8"
		>
			<NuxtLink
				to="/"
				class="flex items-center gap-2.5 text-xs font-extrabold uppercase tracking-[0.04em] text-[#18201e]"
			>
				<span
					class="flex h-7 w-7 items-center justify-center bg-[#b55b3e] font-serif text-[11px] text-white"
					>NB</span
				>
				North Blade
			</NuxtLink>
			<nav
				class="ml-auto mr-12 flex gap-8 max-sm:hidden"
				aria-label="Main navigation"
			>
				<NuxtLink
					to="/#services"
					class="text-sm font-bold text-[#6e7972] transition-colors hover:text-[#b55b3e]"
					>Services</NuxtLink
				>
				<NuxtLink
					v-if="user"
					to="/dashboard"
					class="text-sm font-bold text-[#6e7972] transition-colors hover:text-[#b55b3e]"
					>My bookings</NuxtLink
				>
				<NuxtLink
					v-if="isAdmin"
					to="/admin"
					class="text-sm font-bold text-[#6e7972] transition-colors hover:text-[#b55b3e]"
					>Admin</NuxtLink
				>
			</nav>
			<NuxtLink
				v-if="isAdmin"
				to="/admin"
				class="mr-4 text-sm font-bold text-[#6e7972] transition-colors hover:text-[#b55b3e] sm:hidden"
				>Admin</NuxtLink
			>
			<NuxtLink
				v-if="user"
				to="/dashboard"
				class="border-b border-[#18201e] pb-1 text-sm font-extrabold uppercase text-[#18201e]"
				>Book now
				<Icon
					name="lucide:arrow-up-right"
					class="ml-1 size-4 text-[#b55b3e]"
					aria-hidden="true"
			/></NuxtLink>
			<NuxtLink
				v-else
				to="/login"
				class="border-b border-[#18201e] pb-1 text-[11px] font-extrabold uppercase text-[#18201e]"
				>Sign in
				<Icon
					name="lucide:arrow-up-right"
					class="ml-1 size-4 text-[#b55b3e]"
					aria-hidden="true"
			/></NuxtLink>
		</div>
	</header>
</template>
