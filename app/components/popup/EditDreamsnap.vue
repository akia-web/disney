<template>
    <div v-if="showModal"
    class="fixed inset-0 flex items-center justify-center bg-gray-500/80">
        <div class="bg-white rounded shadow w-[60%]">
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

                <p v-if="isShowError && !file"
                     class=" text-red-700 text-xs font-bold mt-4">Image manquante</p>
                  <UiImageInput :image="undefined"
                v-model:file="file"/>
                    
              
                <input type="checkbox" v-model="form.checked" class="opacity-0">

                <div class="flex justify-center gap-2">
                  
                  <button type="button" 
                  class="bg-gray-200 p-4 rounded-lg text-xs"
                  @click="showErrors">
                          Voir les erreurs
                    </button>
                  <button type="submit" 
                  :disabled="v$?.$invalid || !file"
                  class="bg-card-color text-white p-4 rounded-lg font-bold disabled:bg-gray-300 disabled:text-gray-500">
                  {{dreamsnap?'Modifier' : 'Envoyer'}}
                  </button>
                </div>
                
            </form> 
        </div>
        
    </div>
</template>

<script lang="ts" setup>
import type { DreamsnapDto } from '~/interfaces/dreamsnap.dto';
import type { EditDreamsnapDto } from '~/interfaces/edit-dreamnap.dto';
import { minLength, required,minValue } from '@vuelidate/validators';
import { useVuelidate } from '@vuelidate/core';
import { validDate } from '~/validator/validDate';

const props = defineProps({
    showModal: Boolean,
    title: String,
    dreamsnap: Object as PropType<DreamsnapDto>
});


const emit = defineEmits(['closeModal']);

const close = (Dreamsnap? : DreamsnapDto) => {
  resetForm()
  emit('closeModal', Dreamsnap );
};

const moonlights = [300, 600, 900, 1200, 1500, 2500, 4000, 7000, 8500, 10000, 12000]


const selectedMoonLight = ref(0)
const open = ref(false)

const fileName = ref('')
const file = ref()
const preview = ref('')
const isShowError=ref(false);

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
    if(newValue){
      form.theme = newValue.theme
      form.rank = newValue.rank.toString()
      form.date = newValue.date.toDateString()
      selectedMoonLight.value = newValue.moonlight;   
    }
  }
)

const selectMoonlight = (moonlight:number) => {
  form.moonstones = moonlight
  open.value = false
}

onBeforeUnmount(() => {
  if (preview.value) {
    URL.revokeObjectURL(preview.value)
  }
})


const showErrors = () => {
  v$.value.$touch()
  isShowError.value = true
}

const send = async () => {
  if(!props.dreamsnap){
    const formData = new FormData()

    formData.append('theme', form.theme)
    formData.append('moonlight', String(form.moonstones))
    formData.append('rank', String(form.rank))
    formData.append('checked', String(form.checked))
    formData.append('date', String(form.date))

    if (file.value) {
      formData.append('file', file.value)
    }


   const save : DreamsnapDto = await $fetch<DreamsnapDto>('/api/dreamsnap/create', {
      method: 'POST',
      body: formData
    })

    close(save)

  }else{

    if(props.dreamsnap && props.dreamsnap.id){
      const formSend : EditDreamsnapDto = {
        theme: form.theme,
        checked: form.checked,
        moonlight: selectedMoonLight.value,
        rank: Number(form.rank),
        id: props.dreamsnap.id,
        date: form.date ? new Date(form.date) : new Date()
      }

     const save : DreamsnapDto = await $fetch<DreamsnapDto>(`/api/dreamsnap/${props.dreamsnap.id}`, {
        method: 'PATCH',
        body: formSend
      })

      close(save)
    }

  }
}

</script>