<template>
  <div class="bg-linear-to-b from-card-color to-card-color/70 min-h-100vh w-full">
    <header class="sticky top-0 z-50 ">
      <div>
        <LayoutAppNavBar />
      </div>
    </header>

    <div class="w-[90%] mx-auto">
      <div class="mt-4 min-h-[85vh]">
        <NuxtPage/>
      </div>
    </div>
    <Footer/>
  </div>
</template>


<script setup lang="ts">
import Footer from '~/components/Footer.vue';

</script>