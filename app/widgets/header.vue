<script lang="ts" setup>
import type { Database } from '~~/types/database.types'

const user = useSupabaseUser()
const supabase = useSupabaseClient<Database>()
const route = useRoute()
const isAdmin = ref(false)
const isMobileMenuOpen = ref(false)
let previousBodyOverflow = ''
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
watch(
	() => route.fullPath,
	() => {
		isMobileMenuOpen.value = false
	},
)

function updateBodyScrollLock(locked: boolean) {
	if (!import.meta.client) return

	if (locked) {
		previousBodyOverflow = document.body.style.overflow
		document.body.style.overflow = 'hidden'
	} else {
		document.body.style.overflow = previousBodyOverflow
	}
}

function handleEscape(event: KeyboardEvent) {
	if (event.key === 'Escape') closeMobileMenu()
}

watch(isMobileMenuOpen, updateBodyScrollLock)

onMounted(() => window.addEventListener('keydown', handleEscape))
onBeforeUnmount(() => {
	updateBodyScrollLock(false)
	window.removeEventListener('keydown', handleEscape)
})

function toggleMobileMenu() {
	isMobileMenuOpen.value = !isMobileMenuOpen.value
}

function closeMobileMenu() {
	isMobileMenuOpen.value = false
}
</script>

<template>
	<header
		class="fixed left-0 top-0 z-30 h-20 w-full border-b border-[#e1e6e1] bg-[#f6f8f5]/90 backdrop-blur-xl"
	>
		<div
			class="mx-auto flex min-h-[4.7rem] max-w-7xl items-center justify-between px-5 lg:px-8"
		>
			<NuxtLink
				to="/"
				class="flex items-center gap-2.5 text-xs font-extrabold uppercase tracking-[0.04em] text-[#18201e]"
			>
				<NuxtImg
					src="/android-chrome-192x192.png"
					alt="North Blade logo"
					width="56"
					height="56"
					class="size-14"
				/>
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
					:aria-current="route.path === '/dashboard' ? 'page' : undefined"
					class="text-sm font-bold"
					:class="
						route.path === '/dashboard'
							? 'pointer-events-none text-[#b55b3e]'
							: 'text-[#6e7972] transition-colors hover:text-[#b55b3e]'
					"
					>My bookings</NuxtLink
				>
				<NuxtLink
					v-if="isAdmin"
					to="/admin"
					:aria-current="route.path === '/admin' ? 'page' : undefined"
					class="text-sm font-bold"
					:class="
						route.path === '/admin'
							? 'pointer-events-none text-[#b55b3e]'
							: 'text-[#6e7972] transition-colors hover:text-[#b55b3e]'
					"
					>Admin</NuxtLink
				>
			</nav>
			<NuxtLink
				v-if="route.path !== '/dashboard' && route.path !== '/admin'"
				:to="user ? `/dashboard` : `/login`"
				class="border-b border-[#18201e] pb-1 text-sm font-extrabold uppercase text-[#18201e] max-sm:hidden"
				>Book now
				<Icon
					name="lucide:arrow-up-right"
					class="ml-1 size-4 text-[#b55b3e]"
					aria-hidden="true"
			/></NuxtLink>
			<NuxtLink
				v-if="!user"
				to="/login"
				class="border-b border-[#18201e] pb-1 text-[11px] font-extrabold uppercase text-[#18201e] max-sm:hidden"
				>Sign in
				<Icon
					name="lucide:arrow-up-right"
					class="ml-1 size-4 text-[#b55b3e]"
					aria-hidden="true"
			/></NuxtLink>
			<button
				type="button"
				class="ml-auto inline-flex size-11 items-center justify-center text-[#18201e] sm:hidden"
				:aria-expanded="isMobileMenuOpen"
				aria-controls="mobile-navigation"
				aria-label="Open navigation menu"
				@click="toggleMobileMenu"
			>
				<Icon name="lucide:menu" class="size-7" aria-hidden="true" />
			</button>
		</div>
	</header>

	<Teleport to="body">
		<Transition
			enter-active-class="transition duration-300 ease-out"
			enter-from-class="opacity-0"
			enter-to-class="opacity-100"
			leave-active-class="transition duration-200 ease-in"
			leave-from-class="opacity-100"
			leave-to-class="opacity-0"
		>
			<div
				v-if="isMobileMenuOpen"
				id="mobile-navigation"
				class="fixed inset-0 z-40 flex min-h-screen origin-top flex-col bg-[#18201e] px-8 py-6 text-white sm:hidden"
				@click.self="closeMobileMenu"
			>
				<div class="flex items-center justify-between">
					<NuxtLink
						to="/"
						class="flex items-center gap-2.5 text-xs font-extrabold uppercase tracking-[0.04em]"
						@click="closeMobileMenu"
					>
						<span
							class="flex size-7 items-center justify-center bg-[#b55b3e] font-serif text-[11px]"
							>NB</span
						>
						North Blade
					</NuxtLink>
					<button
						type="button"
						class="inline-flex size-11 items-center justify-center text-[#e9a98d]"
						aria-label="Close navigation menu"
						@click="closeMobileMenu"
					>
						<Icon name="lucide:x" class="size-8" aria-hidden="true" />
					</button>
				</div>

				<nav
					class="flex flex-1 flex-col items-center justify-center gap-7"
					aria-label="Mobile navigation"
				>
					<NuxtLink
						to="/#services"
						class="font-serif text-4xl font-normal transition-colors hover:text-[#e9a98d]"
						@click="closeMobileMenu"
						>Services</NuxtLink
					>
					<NuxtLink
						v-if="user"
						to="/dashboard"
						:class="
							route.path === '/dashboard'
								? 'pointer-events-none text-[#e9a98d]'
								: 'hover:text-[#e9a98d]'
						"
						class="font-serif text-4xl font-normal transition-colors"
						:aria-current="route.path === '/dashboard' ? 'page' : undefined"
						@click="closeMobileMenu"
						>My bookings</NuxtLink
					>
					<NuxtLink
						v-if="isAdmin"
						to="/admin"
						:class="
							route.path === '/admin'
								? 'pointer-events-none text-[#e9a98d]'
								: 'hover:text-[#e9a98d]'
						"
						class="font-serif text-4xl font-normal transition-colors"
						:aria-current="route.path === '/admin' ? 'page' : undefined"
						@click="closeMobileMenu"
						>Admin</NuxtLink
					>
					<NuxtLink
						v-if="!user"
						to="/login"
						class="font-serif text-4xl font-normal transition-colors hover:text-[#e9a98d]"
						@click="closeMobileMenu"
						>Sign in</NuxtLink
					>
				</nav>

				<div
					class="border-t border-white/15 pt-5 text-center text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#aebbb3]"
				>
					Mon–Sun · 10:00–20:00
				</div>
			</div>
		</Transition>
	</Teleport>
</template>
