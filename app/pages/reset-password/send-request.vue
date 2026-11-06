<template>
    <div class="bg-white p-2.5 mt-4 md:w-[50%] mx-auto h-[80vh] rounded-xl">
        <h1 class="text-center mt-8 mb-8">Demande de reset de mot de passe</h1>
        
        <div class="border border-card-color p-2 rounded-xl bg-info-popup text-white flex gap-2" >

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
                class="bg-card-color text-gold p-4 rounded-lg font-bold disabled:bg-gray-300 disabled:text-gray-500">
                Demander à changer le mot de passe
        </button>
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