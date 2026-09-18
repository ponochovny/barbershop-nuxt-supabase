<script lang="ts" setup>
import Header from '~/widgets/header.vue'
import Footer from '~/widgets/footer.vue'
import 'vue-sonner/style.css'
</script>

<template>
	<Header />
	<div class="container mx-auto mt-20 px-5 lg:px-8">
		<slot />
	</div>
	<Footer />
	<Toaster position="bottom-center" richColors />
</template>
