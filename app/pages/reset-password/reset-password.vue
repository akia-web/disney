<template>
    <div class="bg-white p-2.5 mt-4 md:w-[50%] mx-auto h-[80vh] rounded-xl">
        <h1 class="text-center mt-8 mb-8">Définir un nouveau mot de passe</h1>
        <form>
            <div class="flex flex-col mt-8">
                <div class="flex gap-2 items-center">
                <label for="password">
                   Nouveau mot de passe
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
            <div>
                <input type="checkbox" v-model="form.checked" class="opacity-0">
            </div>
        </form>

        <div class="flex justify-center">
            <button @click="savePassword" 
            :disabled="v$.$invalid"
            class="bg-card-color text-gold p-4 rounded-lg font-bold disabled:bg-gray-300 disabled:text-gray-500 ">Changer le mot de passe</button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import useVuelidate from '@vuelidate/core';
import { minLength, required } from '@vuelidate/validators';
    const route = useRoute()
    const code = computed(() => {
        const value = useRoute().query.code
        return typeof value === 'string' ? value : null
    })


    const showPassword = ref(false)
    const toast = useToast()

    const form = reactive({
        password: '',
        code:'',
        checked: false,
    });

    const rules = computed(() => ({
        password: { required, minLength: minLength(6) },
    }));

    const v$ = useVuelidate(rules, form, { $autoDirty: true });
    
    onMounted(()=>{
       if(code.value){
        form.code = code.value
       }else{
         navigateTo('/reset-password/send-request')
       }
    })

    const savePassword = async () => {
        try{
            await $fetch('/api/auth/update-password-without-connexion', {
            method: 'POST',
            body: form
            })

            await navigateTo('/connexion')
            toast.success('Changement de mot de passe réussie')
        }catch(error: any){
            toast.error(error.data?.message)
        }

    }
</script>