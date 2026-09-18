<script lang="ts" setup>
const user = useSupabaseUser()
</script>

<template>
	<footer class="mt-24 border-t border-[#dce1dc] bg-[#18201e] text-white">
		<div
			class="mx-auto grid max-w-7xl gap-10 px-5 py-12 lg:grid-cols-[1.3fr_1fr_1fr_1fr] lg:px-8"
		>
			<div>
				<NuxtLink
					to="/"
					class="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.04em]"
				>
					<span
						class="flex h-7 w-7 items-center justify-center bg-[#b55b3e] font-serif text-[11px]"
						>NB</span
					>
					North Blade
				</NuxtLink>
				<p class="mt-5 max-w-xs text-sm leading-6 text-[#aebbb3]">
					A barbershop for people who value precision, good conversation, and
					their own rhythm.
				</p>
			</div>
			<div>
				<p
					class="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#e9a98d]"
				>
					Navigation
				</p>
				<div class="mt-4 flex flex-col gap-3 text-sm text-[#d4ddd7]">
					<NuxtLink
						to="/#services"
						class="transition-colors hover:text-[#e9a98d]"
						>Services</NuxtLink
					>
					<NuxtLink
						v-if="user"
						to="/dashboard"
						class="transition-colors hover:text-[#e9a98d]"
						>My bookings</NuxtLink
					>
				</div>
			</div>
			<div>
				<p
					class="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#e9a98d]"
				>
					Opening hours
				</p>
				<p class="mt-4 text-sm leading-6 text-[#d4ddd7]">
					Mon–Sun<br />10:00–20:00
				</p>
			</div>
			<div>
				<p
					class="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#e9a98d]"
				>
					Contact
				</p>
				<p class="mt-4 text-sm leading-6 text-[#d4ddd7]">
					8 Velyka Street<br />+380 67 000 00 00
				</p>
			</div>
		</div>
		<div
			class="mx-auto flex max-w-7xl flex-col gap-2 border-t border-white/10 px-5 py-5 text-[11px] text-[#87958d] sm:flex-row sm:items-center sm:justify-between lg:px-8"
		>
			<span>© 2026 North Blade</span>
			<span>Made for feeling good</span>
		</div>
	</footer>
</template>
