<template>
      <div class="min-h-[calc(100vh-var(--mobileNav))] w-full flex justify-center items-center">
              <img src="~/assets/images/ddv-desktop-request-password.png" class="hidden md:block  h-[80vh] object-cover rounded-tl-xl rounded-bl-xl" alt="">

    <div class="bg-white p-4 w-full md:w-[30%] md:min-w-120 rounded-lg md:rounded-tl-none md:rounded-bl-none h-[80vh]">
        <img src="~/assets/images/ddv-mobile-request-password.png" class="md:hidden rounded" alt="">

        <h1 class="text-center mt-8 mb-8">Demande de reset de mot de passe</h1>

        <div class="border border-card-color p-2 rounded-xl bg-info-popup mt-4 text-white flex gap-2" >

            <ClientOnly>
              <Icon name="ant-design:info-circle-outlined"
                  size="24"
              />
            </ClientOnly>
            <div>
                <p class="text-xs italic">Un courriel avec un lien pour changer votre mot de passe vous sera envoyé à l'adresse email que vous renseignerez ci-dessous.</p>
                <p class="text-xs italic">L'adresse que vous renseignez doit être celle utilisée pour vous connecter à votre compte</p>

            </div>
        </div>

        
        <form>
            <UiLabelAndInput v-model:property="form.email"
                        id="email"
                        placeholder="Email"
                        type="text"
                        :propertyRules="v$?.email"
                        errorMessage="Email invalide"
                        label="Email*"/>
            <input type="checkbox" v-model="form.checked" class="opacity-0">


        </form>

        <div class="flex justify-center mt-8">
        <button @click="sendRequest" 
                :disabled="v$.$invalid"
                :class="{'cursor-not-allowed':v$.$invalid, 'cursor-pointer': !v$.$invalid}"
                class="bg-card-color text-gold p-4 rounded-lg font-bold disabled:bg-gray-300 disabled:text-gray-500 hover:bg-gold hover:text-card-color transition-colors duration-100 ease-in-out">
                Demander à changer le mot de passe
        </button>
        </div>
         <NuxtLink to="/connexion">
          <div class="flex items-center gap-2 mt-8">
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

    const form = reactive({
    email: '',
    checked: false,
    });

    const rules = computed(() => ({
    email: { required, minLength: minLength(4), email },
    }));

      const toast = useToast()

    const v$ = useVuelidate(rules, form, { $autoDirty: true });

    const sendRequest = async () => {
        await $fetch<any>('/api/auth/send-request-reset-password', {
                method: 'POST',
                body: form
            })
        toast.success('Si cette adresse existe, un email de réinitialisation sera envoyé.')
    }
</script>