<template>
   <div class="fixed inset-0 flex items-center justify-center bg-gray-500/80">
        <div class="bg-white rounded shadow w-full md:w-[60%] h-full md:max-h-[85%] overflow-y-auto">
            <div class="flex gap-2 items-center justify-between bg-card-color text-white p-4">
                <h1>{{ title }}</h1>
                <ClientOnly>
                <Icon name="ic:baseline-cancel" 
                        size="24"
                        @click="close"/>
                </ClientOnly>   
            </div>
        
            <form class="p-4" @submit.prevent="send">
                <UiLabelAndInput v-model:property="form.theme"
                                    id="theme"
                                    placeholder="Theme"
                                    type="text"
                                    :propertyRules="v$?.theme"
                                    errorMessage="Thème requis"
                                    label="Theme*"/>


                <div class="relative w-full mt-4">
                    <div class="flex gap-2 items-center">
                      <p class="mb-2">Pierres de lunes*</p>
                      <p v-if="v$?.moonstones.$error"
                                class=" text-red-700 text-xs font-bold">
                             Selectionnez une récompense
                      </p>
                    </div>
                    
                    <button type="button"
                            @click="open = !open"
                             @blur="v$?.moonstones.$touch()"
                            class="flex w-full items-center gap-3 rounded-lg border px-4 py-2">
                        <div v-if="form.moonstones"
                                class="flex items-center gap-2"> 
                            <span>
                                {{ form.moonstones  }}
                            </span>
                         <img src="~/assets/Pierre_de_lune.webp" class="w-3.75 h-3.75">
                        
                        </div>
                         <span v-else> Choisir une récompense</span>
                    </button>


                        <div v-if="open"
                                class="absolute z-10 mt-2 max-h-60 w-full overflow-y-auto rounded-lg border bg-white shadow scrollbar-thin">
                            
                                <div v-for="moonlight in moonlights"
                                :key="moonlight"
                                @click="selectMoonlight(moonlight)"
                                class="flex cursor-pointer items-center gap-3 px-4 py-2 hover:bg-gray-100">
                            
                                <span>{{ moonlight }}</span>
                                <img src="~/assets/Pierre_de_lune.webp" class="w-3.75 h-3.75">
                            </div>
                        </div>
                </div>

                <UiLabelAndInput v-model:property="form.rank"
                                    id="rang"
                                    placeholder="Rang"
                                    type="number"
                                    label="Rang"
                                    :propertyRules="v$?.rank"
                                    errorMessage="Rang requis"
                                    min="1"/>


                <div class="flex gap-2 items-center">
                  <p class="mb-2 mt-2">Date</p>
                  <p v-if="v$?.date.$error"
                      class=" text-red-700 text-xs font-bold">
                      Date requise
                  </p>
                </div>
                
                <input type="date"
                v-model="form.date"
                @blur="v$?.moonstones.$touch()"
                class="border p-2 rounded-lg">

                <p v-if="isShowError && (!dreamsnap && !file)"
                     class=" text-red-700 text-xs font-bold mt-4">Image manquante</p>
                  <UiImageInput :image="dreamsnap?.image"
                v-model:file="file"/>
                    
              
                <input type="checkbox" v-model="form.checked" class="opacity-0">

                <div class="flex justify-center items-center gap-2">

                  
                  <button v-if="dreamsnap"
                  type="button"
                  @click="deleteDreamsnap"
                  :disabled="isLoading"
                  class="bg-white text-red-800 cursor-pointer  p-4 rounded-lg font-bold border border-red-800 hover:bg-light-grey disabled:bg-gray-300 disabled:text-gray-500">
                  Supprimer
                  </button>

                  
                  <button type="submit" 
                  :disabled="v$?.$invalid || (!dreamsnap && !file) || isLoading"
                  class="bg-card-color text-white p-4 rounded-lg font-bold disabled:bg-gray-300 disabled:text-gray-500">
                  {{dreamsnap?'Modifier' : 'Envoyer'}}
                  </button>

                  <ClientOnly>
                    <Icon name="akar-icons:info" class="text-card-color" size="24"
                    @click="showErrors"/>
                  </ClientOnly>
                </div>
                
            </form> 
        </div>
   </div>
</template>

<script lang="ts" setup>
import type { DreamsnapDto } from '~/interfaces/dreamsnap.dto';
import { minLength, required,minValue } from '@vuelidate/validators';
import { useVuelidate } from '@vuelidate/core';
import { validDate } from '~/validator/validDate';

const props = defineProps({
    title: String,
    dreamsnap: Object as PropType<DreamsnapDto>
});


const emit = defineEmits(['closeModal']);

const close = (Dreamsnap? : DreamsnapDto, isDeleted?: boolean) => {
  resetForm()
  emit('closeModal', Dreamsnap, isDeleted);
};

const moonlights = [300, 600, 900, 1200, 1500, 2500, 4000, 7000, 8500, 10000, 12000]


const selectedMoonLight = ref(0)
const open = ref(false)

const fileName = ref('')
const file = ref()
const preview = ref('')
const isShowError=ref(false);
const isLoading = ref(false);
const toast = useToast()

const form = reactive({
  theme: '',
  rank: '0',
  moonstones: undefined as number|undefined,
  date: new Date().toISOString().split('T')[0],
  checked: false
});

const rules = computed(() => ({
  theme: { required, minLength: minLength(4) },
  rank: { required, minLength: minLength(1),  minValue: minValue(1) },
  moonstones: {required},
  date: {required, validDate }
}));

const v$ = useVuelidate(rules, form, { $autoDirty: true });

const resetForm = () => {
  selectedMoonLight.value = 0;
  fileName.value = '';
  file.value = undefined;
  preview.value = '';
  form.theme = '';
  form.rank = '0';
  form.checked = false;
  form.date= new Date().toISOString().split('T')[0]
  v$.value.$reset();
}

watch(
  () => props.dreamsnap,
  (newValue, oldValue) => {
    console.log('props.dreamsnap changed:', newValue);
    if(newValue){
      form.theme = newValue.theme
      form.moonstones = newValue.moonlight
      form.rank = newValue.rank.toString()
      form.date = new Date (newValue.date).toISOString().split('T')[0]
      selectedMoonLight.value = newValue.moonlight;   
    }
  },{ immediate: true }
)

const selectMoonlight = (moonlight:number) => {
  form.moonstones = moonlight
  open.value = false
}

onBeforeUnmount(() => {
  if (preview.value ) {
    URL.revokeObjectURL(preview.value )
  }
})


const showErrors = () => {
  v$.value .$touch()
  isShowError.value = true
}

const send = async () => {
  const formData = new FormData()
  const url = props.dreamsnap ? `/api/dreamsnap/${props.dreamsnap.id}` : '/api/dreamsnap/create'


  formData.append('theme', form.theme)
  formData.append('moonlight', String(form.moonstones))
  formData.append('rank', String(form.rank))
  formData.append('checked', String(form.checked))
  formData.append('date', String(form.date))

  if (file.value) {
    formData.append('file', file.value)
  }

  try {
    isLoading.value = true
    const save : DreamsnapDto = await $fetch<DreamsnapDto>(url, {
        method: props.dreamsnap ? 'PATCH' : 'POST',
        body: formData
      })
      toast.success(props.dreamsnap ? 'Dreamsnap modifié' : 'Dreamsnap ajouté')
    close(save)
  } catch (error:any) {
    toast.error(error.data?.message)
  }finally {
    isLoading.value = false
  }


}


const deleteDreamsnap = async () => {
  if (!props.dreamsnap) return;

  try {
    isLoading.value = true
    await $fetch(`/api/dreamsnap/${props.dreamsnap.id}`, {
      method: 'DELETE',
      body: {checked: form.checked}
    })
    toast.success('Dreamsnap supprimé')
    close(props.dreamsnap, true)
  } catch (error:any) {
    toast.error(error.data?.message)
  } finally {
    isLoading.value = false
  }
}
  


</script>