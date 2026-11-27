<template>
  <div class="min-h-[calc(100vh-var(--mobileNav))] w-full flex justify-center items-center">
    <img src="~/assets/images/ddv-desktop.png" class="hidden md:block  h-[80vh] object-cover rounded-tl-xl rounded-bl-xl" alt="">
    
    <div class="bg-white p-4 w-full md:w-[30%] md:min-w-120 rounded-lg md:rounded-tl-none md:rounded-bl-none min-h-[80vh]">
      <img src="~/assets/images/ddv-mobile.jpg" class="md:hidden rounded" alt="">
      <h1 class="text-center mt-4 mb-4">Connexion</h1>


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

              <NuxtLink to="/reset-password/send-request" class="text-card-color underline mt-4 text-right block">
                Mot de passe oublié?
        </NuxtLink>

          
      </form>
    <div>
      <input type="checkbox" v-model="form.checked" class="opacity-0">
    </div>
    
     
    <div class="flex justify-center">
      <button @click="register" 
            :disabled="v$.$invalid"
            :class="{'cursor-not-allowed':v$.$invalid, 'cursor-pointer': !v$.$invalid}"
            class="bg-card-color text-gold p-4 rounded-lg font-bold disabled:bg-gray-300 disabled:text-gray-500 hover:bg-gold hover:text-card-color transition-colors duration-100 ease-in-out">
            Se connecter
    </button>
    </div>
    

    <div class="flex items-center gap-2 mt-4">
      <div class="w-[50%] border h-0"></div>
      <p>OU</p>
      <div class="w-[50%] border h-0"></div>
    </div>

    <h2 class="mt-8 text-center">Pas de compte?</h2>

    <div class="mt-4 p-2">
      <NuxtLink to="/inscription" class="text-card-color underline">
      S'inscrire
      </NuxtLink>
    </div>
    </div>
  </div>


</template>
<script lang="ts" setup>
import { minLength, required,minValue, email } from '@vuelidate/validators';
import { useVuelidate } from '@vuelidate/core';

const auth = useAuthStore()

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
  const toast = useToast()

const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
        register()
    }

};


const register = async () => {
  if(!v$?.value .$invalid){
    
    const response = await auth.login(form)
    
    if(response){
      toast.error(response)
    }else{
      toast.success('Connexion réussie')
        navigateTo('/')
    }
  }
}

onMounted(() => {
    window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown);
});

</script>