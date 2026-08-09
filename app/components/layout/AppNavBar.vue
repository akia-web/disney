<template>
  <div class="flex bg-white/90 justify-between align-center items-center p-2.5 shadow-md">
    <NuxtLink to="/">
       <ClientOnly>
         <Icon name="mdi-light:home" />
       </ClientOnly>
    </NuxtLink>

      <div class="flex gap-6">
        <NuxtLink :to="'/personnages'">
          <div class="flex items-center gap-2">
            <ClientOnly>
              <Icon name="mdi-light:account" />
            </ClientOnly>   
            <p>Personnages</p>
          </div>
        </NuxtLink>
      </div>

      <div v-if="!auth.user">
         <NuxtLink :to="'/connexion'">
          <ClientOnly>
            <Icon name="mdi-light:book" />
          </ClientOnly>
        </NuxtLink>
      </div>

      <div v-else>
        <ClientOnly>
          <Icon @click="logout" name="cuida:power-outline" />
        </ClientOnly>
      </div>
     

  </div>


</template>


<script lang="ts" setup>
import { useAuthStore } from '~/stores/auth'

const auth = useAuthStore()

const logout = async() =>{
   await auth.logout()
   navigateTo('/')
}

onMounted(()=>{
  auth.fetchUser()
})

</script>



<style scoped>
.logo {
  width: 130px;
}
</style>