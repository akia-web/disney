<template>
    <div
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
                <UiLabelAndInput v-model:property="form.name"
                                    id="name"
                                    placeholder="Nom"
                                    type="text"
                                    label="Nom"/>
                <UiLabelAndInput v-model:property="form.level"
                                    id="level"
                                    placeholder="Niveau"
                                    type="number"
                                    label="Niveau"
                                    min="1"
                                    max="10"/>
                    
                <div class="relative w-full mt-4">
                    <button type="button"
                            @click="open = !open"
                            class="flex w-full items-center gap-3 rounded-lg border px-4 py-2">
                        <img v-if="selectedJob"
                        :src="getImage()"
                        class="h-8 w-8 rounded object-cover"/>

                        <span> {{ selectedJob || 'Choisir un métier' }}</span>
                    </button>


                        <div v-if="open"
                                class="absolute z-10 mt-2 max-h-60 w-full overflow-y-auto rounded-lg border bg-white shadow scrollbar-thin">
                            
                                <div v-for="job in jobs"
                                :key="job.name"
                                @click="selectJob(job.name)"
                                class="flex cursor-pointer items-center gap-3 px-4 py-2 hover:bg-gray-100">
                                
                                <img :src="job.url"
                                class="h-10 w-10 rounded object-cover"/>

                                <span>{{ job.name }}</span>
                            </div>
                        </div>
                </div>

                <div class="flex flex-col gap-2 mt-4" v-if="!character">
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

                <img v-if="character?.image"
                            :src="character.image"
                            alt="Aperçu"
                            class="h-32 w-32 rounded-lg object-cover mt-4" />
                
                <input type="checkbox" v-model="form.checked" class="opacity-0">

                <div class="text-center">
                  <button type="submit" class="bg-card-color text-white p-4 rounded-lg font-bold">{{character?'Modifier' : 'Envoyer'}}</button>
                </div>
                
            </form> 
        </div>
        
    </div>
</template>

<script lang="ts" setup>
import type { CharacterDto } from '~/interfaces/characters-dto';
import type { EditCharacterDto } from '~/interfaces/edit-character.dto';
import type { JobsDto } from '~/interfaces/jobs-dto';

const props = defineProps({
    showModal: Boolean,
    title: String,
    jobs: Array as PropType<JobsDto[]>,
    character: Object as PropType<CharacterDto>
});

const emit = defineEmits(['closeModal']);

const close = (character? : CharacterDto) => {
  resetForm()
  emit('closeModal', character );
};


const selectedJob = ref('')
const open = ref(false)

const fileName = ref('')
const file = ref()
const preview = ref('')

const form = reactive({
  name: '',
  level: '',
  checked: false
});

const resetForm = () => {
  selectedJob.value='';
  fileName.value = '';
  file.value = undefined;
  preview.value = '';
  form.name = '';
  form.level = '';
  form.checked = false;
}

watch(
  () => props.character,
  (newValue, oldValue) => {
    if(newValue){
      form.name = newValue.name
      form.level = newValue.level.toString()
      selectedJob.value = newValue.job;   
    }
  }
)


const getImage = () => {
  if (props.jobs) {
    const job = props.jobs.find(
      (element) => element.name === selectedJob.value
    )

    return job?.url
  }

  return ''
}

const selectJob = (job:string) => {
  selectedJob.value = job
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
  if(!props.character){
    const formData = new FormData()

    formData.append('name', form.name)
    formData.append('level', form.level)
    formData.append('job', selectedJob.value)
    formData.append('checked', String(form.checked))

    if (file.value) {
      formData.append('file', file.value)
    }

   const save : CharacterDto = await $fetch<CharacterDto>('/api/character/create', {
      method: 'POST',
      body: formData
    })

    close(save)

  }else{

    if(props.character && props.character.id){
      const formSend : EditCharacterDto = {
        level: form.level,
        checked: form.checked,
        job: selectedJob.value,
        name: form.name,
        id: props.character.id
      }

     const save : CharacterDto = await $fetch<CharacterDto>(`/api/character/${props.character.id}`, {
        method: 'PATCH',
        body: formSend
      })

      close(save)
    }

  }

  

}

</script>