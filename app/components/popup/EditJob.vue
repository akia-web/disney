<template>
    <div v-if="showModal"
    class="fixed inset-0 flex items-center justify-center bg-gray-500/80">
        <div class="bg-white rounded shadow w-[60%]">
            <div class="flex gap-2 items-center justify-between bg-card-color text-pink bg-background p-4">
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
                    
                <UiImageInput :image="job?.image"
                v-model:file="file"/>

                <input type="checkbox" v-model="form.checked" class="opacity-0">

                <div class="text-center">
                  <button type="submit" class="bg-background text-pink p-4 rounded-lg font-bold">{{job?'Modifier' : 'Envoyer'}}</button>
                </div>
                
            </form> 
        </div>
        
    </div>
</template>

<script lang="ts" setup>
import type { JobsDto } from '~/interfaces/jobs-dto';


const props = defineProps({
    showModal: Boolean,
    title: String,
    job: Object as PropType<JobsDto>
});

const emit = defineEmits(['closeModal']);

const close = (job? : JobsDto) => {
  resetForm()
  emit('closeModal', job );
};


const file = ref()

const form = reactive({
  name: '',
  checked: false
});

const resetForm = () => {;
  file.value = undefined;
  form.name = '';
  form.checked = false;
}

watch(
  () => props.job,
  (newValue, oldValue) => {
    if(newValue){
      form.name = newValue.name
    }
  }
)



const send = async () => {

    const formData = new FormData()

    formData.append('name', form.name)
    formData.append('checked', String(form.checked))

    if (file.value) {
      formData.append('file', file.value)
    }

    
  if(!props.job){
   const save : JobsDto = await $fetch<JobsDto>('/api/admin/jobs/create', {
      method: 'POST',
      body: formData
    })
    close(save)

    }else{

        const save : JobsDto = await $fetch<JobsDto>(`/api/admin/jobs/${props.job.id}`, {
            method: 'PATCH',
            body: formData
        })

        close(save)
    }

  }


</script>