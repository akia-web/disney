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
                  

              <UiImageInput :image="undefined"
                v-model:file="file"/>
         
                
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
import type { EditAdminCharacterDto } from '~/interfaces/edit-admin-character.dto';
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


const file = ref()

const form = reactive({
  name: '',
  level: '',
  checked: false
});

const resetForm = () => {
  file.value = undefined;
  form.name = '';
  form.checked = false;
}

watch(
  () => props.character,
  (newValue, oldValue) => {
    if(newValue){
      form.name = newValue.name 
    }
  }
)

const send = async () => {
  if(!props.character){
    const formData = new FormData()

    formData.append('name', form.name)
    formData.append('checked', String(form.checked))

    if (file.value) {
      formData.append('file', file.value)
    }

   const save : CharacterDto = await $fetch<CharacterDto>('/api/admin/character/create', {
      method: 'POST',
      body: formData
    })

    close(save)

  }else{

    if(props.character && props.character.id){
      const formSend : EditAdminCharacterDto = {
        checked: form.checked,
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