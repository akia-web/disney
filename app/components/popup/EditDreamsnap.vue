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
                                    label="Theme"/>


                <div class="relative w-full mt-4">
                    <p class="mb-2">Pierres de lunes</p>
                    <button type="button"
                            @click="open = !open"
                            class="flex w-full items-center gap-3 rounded-lg border px-4 py-2">
                        <div v-if="selectedMoonLight"
                                class="flex items-center gap-2"> 
                            <span>
                                {{ selectedMoonLight  }}
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
                                    min="1"/>


                <p class="mb-2 mt-2">Date</p>
                <input type="date"
                v-model="form.date"
                class="border p-2 rounded-lg">
                    
                <div class="flex flex-col gap-2 mt-4" v-if="!dreamsnap">
                        <label
                        for="image"
                        class="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-8 text-gray-600 transition hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600"
                        >
                        📁
                        <span>{{ fileName || "Choisir une image" }}</span>
                        </label>

                        <input
                        id="image"
                        type="file"
                        class="hidden"
                        @change="onFileChange"
                        />
                </div>
                    
                <img v-if="preview"
                            :src="preview"
                            alt="Aperçu"
                            class="h-32 w-32 rounded-lg object-cover mt-4" />

                <img v-if="dreamsnap?.image"
                            :src="dreamsnap.image"
                            alt="Aperçu"
                            class="h-32 w-32 rounded-lg object-cover mt-4" />
                
                <input type="checkbox" v-model="form.checked" class="opacity-0">

                <div class="text-center">
                  <button type="submit" class="bg-card-color text-white p-4 rounded-lg font-bold">{{dreamsnap?'Modifier' : 'Envoyer'}}</button>
                </div>
                
            </form> 
        </div>
        
    </div>
</template>

<script lang="ts" setup>
import type { DreamsnapDto } from '~/interfaces/dreamsnap.dto';
import type { EditDreamsnapDto } from '~/interfaces/edit-dreamnap.dto';

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

const form = reactive({
  theme: '',
  rank: '0',
  date: new Date().toISOString().split('T')[0],
  checked: false
});

const resetForm = () => {
  selectedMoonLight.value = 0;
  fileName.value = '';
  file.value = undefined;
  preview.value = '';
  form.theme = '';
  form.rank = '0';
  form.checked = false;
  form.date=''
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
  selectedMoonLight.value = moonlight
  open.value = false
}

const onFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement

  if (input.files && input.files.length > 0) {
    file.value = input.files[0]
    fileName.value = file.value.name

    if (preview.value) {
      URL.revokeObjectURL(preview.value)
    }

    preview.value = URL.createObjectURL(file.value)
  } else {
    if (preview.value) {
      URL.revokeObjectURL(preview.value)
    }

    file.value = undefined
    fileName.value = ''
    preview.value = ''
  }
}

onBeforeUnmount(() => {
  if (preview.value) {
    URL.revokeObjectURL(preview.value)
  }
})

const send = async () => {
  if(!props.dreamsnap){
    const formData = new FormData()

    formData.append('theme', form.theme)
    formData.append('moonlight', String(selectedMoonLight.value))
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