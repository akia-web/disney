<template>
    <footer class="bg-gold p-2" >
        <div class="flex justify-between">
            <NuxtLink :to="'/mentions-legales'"  class="underline">
                <p>Mentions légales</p>
            </NuxtLink>
            <div class=" text-center">
            <p>Version : {{ config.public.appVersion }}</p>
            </div>
            <NuxtLink :to="'/politique-de-confidentialite'"  class="underline">
                <p>Politique de confidentialité</p>
            </NuxtLink>
        </div>


  </footer>
</template>
<script lang="ts" setup>
    const config = useRuntimeConfig()
</script>