<template>
  <div class="bg-white p-2.5 mt-4 md:w-[50%] mx-auto h-[80vh]">
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
      class="bg-card-color text-gold p-4 rounded-lg font-bold disabled:bg-gray-300 disabled:text-gray-500 ">S'inscrire</button>
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