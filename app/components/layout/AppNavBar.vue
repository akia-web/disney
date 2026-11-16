<template>
  <div class="flex bg-white/90 justify-between align-center items-center p-2.5 shadow-md">
    
      <div class="flex gap-6" v-for="item in navBarRoute">
        <NuxtLink :to="item.link">
          <div class="flex items-center gap-2">
            <ClientOnly>
              <Icon :name=item.iconName />
            </ClientOnly>   
            <p>{{item.name}}</p>
          </div>
        </NuxtLink>
      </div>

     

      <div v-if="!auth.user">
         <NuxtLink :to="'/connexion'" class="flex items-center gap-2">
          <ClientOnly>
            <Icon name="mdi-light:book" />
          </ClientOnly>
          <p>Connexion</p>
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
import { navBarRoutes } from '~/conf/nav-bar'
import { useAuthStore } from '~/stores/auth'
const navBarRoute = navBarRoutes

const auth = useAuthStore()

const logout = async() =>{
   await auth.logout()
   navigateTo('/')
}

</script>



<style scoped>
.logo {
  width: 130px;
}
</style>