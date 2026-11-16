<template>
  <div class="bg-linear-to-b from-card-color to-card-color/70  w-full min-h-screen">
    <header class="hidden md:block sticky top-0 z-50"">
      <div>
        <LayoutAppNavBar />
      </div>
    </header>

    <div class="w-[90%] mx-auto min-h-[calc(100vh-45px)]">
      <div class="md:mt-[var--(deskNav)] p-4 mb-15 md:mb-0">
        <NuxtPage/>
      </div>
    </div>

    <LayoutAppNavBarMobile class="md:hidden fixed bottom-0 z-50 w-full"/>
    <Footer class="hidden md:block"/>
  </div>
</template>


<script setup lang="ts">
import Footer from '~/components/Footer.vue';

</script>