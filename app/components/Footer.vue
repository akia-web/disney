<template>
    <footer class="bg-gold p-2" >
        <p class="text-center mt-1">
            Ce site n'est pas un site officiel de Disney Dreamlight Valley. Il n'est pas affilié à Disney ou à ses filiales. <br> Toutes les images, vidéos et marques sont la propriété de Disney et de ses filiales.  Ce site est un projet de fans et n'a aucun but lucratif.
        </p>
        <div class="flex justify-between mt-4">
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