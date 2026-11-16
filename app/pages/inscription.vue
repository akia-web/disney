<template>
  <div class="min-h-[calc(100vh-var(--mobileNav))] w-full flex justify-center items-center">
      <img src="~/assets/images/ddv-desktop-inscription.png" class="hidden md:block  h-[80vh] object-cover rounded-tl-xl rounded-bl-xl" alt="">

    <div class="bg-white p-4 w-full md:w-[30%] md:min-w-120 rounded-lg md:rounded-tl-none md:rounded-bl-none h-[80vh]">
        <img src="~/assets/images/ddv-mobile-inscription.png" class="md:hidden rounded" alt="">

      <h1 class="text-center mt-4 mb-4">Inscription</h1>
      <form>
        <UiLabelAndInput v-model:property="form.email"
                      id="email"
                      placeholder="Email"
                      type="text"
                      :propertyRules="v$?.email"
                      errorMessage="Email invalide"
                      label="Email*"/>

        <div class="flex flex-col mt-4">
          <div class="flex gap-2 items-center">
            <label for="password">
              Mot de passe
            </label>
            <p v-if="v$?.password.$error"
            class=" text-red-700 text-xs font-bold">
            Mot de passe requis
            </p>
          </div>

          <div class="relative">
            <input v-model="form.password" 
                :type="showPassword ? 'text' : 'password'" 
                id="password" 
                class="border rounded-[7px] p-2.5 w-full" 
                @blur="v$?.password.$touch()"
                placeholder="Mot de passe">

                <button type="button" 
                    @click="showPassword = !showPassword">
              <ClientOnly>
                <Icon :name="showPassword ? 'material-symbols:visibility-rounded' : 'mdi-light:eye-off'"
                    :class="{
                            'text-pink': showPassword,
                            'text-black': !showPassword
                            }"
                            class="absolute right-1 top-1/2 -translate-y-1/2"
                    size="24"
                />
              </ClientOnly>
            </button>

          </div>

        </div>         
      </form>
      <div>
        <input type="checkbox" v-model="form.checked" class="opacity-0">
      </div>
      
      
      <div class="flex justify-center">
        <button @click="register" 
        :disabled="v$.$invalid"
          :class="{'cursor-not-allowed':v$.$invalid, 'cursor-pointer': !v$.$invalid}"

        class="bg-card-color text-gold p-4 rounded-lg font-bold disabled:bg-gray-300 disabled:text-gray-500 hover:bg-gold hover:text-card-color transition-colors duration-100 ease-in-out">S'inscrire</button>
      </div>

      <NuxtLink to="connexion">
          <div class="flex items-center gap-2 mt-4">
            <ClientOnly>
              <Icon name="bx:arrow-back" />
            </ClientOnly>   
            <p>Connexion</p>
          </div>
        </NuxtLink>

      
    </div>
  </div>
</template>
<script lang="ts" setup>
import useVuelidate from '@vuelidate/core';
import { email, minLength, required } from '@vuelidate/validators';

const toast = useToast()

const form = reactive({
  email: '',
  password: '',
  checked: false,
});

const rules = computed(() => ({
  email: { required, minLength: minLength(4), email },
  password: { required, minLength: minLength(6) },
}));

const v$ = useVuelidate(rules, form, { $autoDirty: true });

const showPassword = ref(false)
const register = async () => {
  try{
    await $fetch('/api/auth/register', {
    method: 'POST',
    body: form
    })

    await navigateTo('/connexion')
     toast.success('Inscription réussie')
  }catch(error: any){
    toast.error(error.data?.message)
  }

  


}
</script>