<template>
    <div
    class="fixed inset-0 flex items-center justify-center bg-gray-500/80 z-99">
        <div class="bg-white rounded shadow w-[90%] md:w-[60%]">
            <div class="flex gap-2 items-center justify-between bg-card-color text-white p-4">
                <h1>{{ title }}</h1>
                <ClientOnly>
                <Icon name="ic:baseline-cancel" 
                        size="24"
                        @click="close(undefined)"/>
                </ClientOnly>   
            </div>
        
            <form class="p-4" @submit.prevent="send">
                <UiSelectOptions  title="Personnage"
                                  id="select1"
                                  column="image"
                                  :selectedOption="selectedCharacter" 
                                  :table="missingCharacter"
                                  @chooseOption="selectFavoriteGift"
                                  :disabled="!!character"/>
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
                        :src="selectedJob.image"
                        class="h-8 w-8 rounded object-cover"/>

                        <span> {{ selectedJob? selectedJob.name : 'Choisir un métier' }}</span>
                    </button>


                        <div v-if="open"
                                class="absolute z-10 mt-2 max-h-41.25 w-full overflow-y-auto rounded-lg border bg-white shadow scrollbar-thin">
                            
                                <div v-for="job in jobsList"
                                :key="job.name"
                                @click="selectJob(job)"
                                class="flex cursor-pointer items-center gap-3 px-4 py-2 hover:bg-gray-100">
                                
                                <img :src="job.image"
                                class="h-10 w-10 rounded object-cover"/>

                                <span>{{ job.name }}</span>
                            </div>
                        </div>
                </div>

                    
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
import type { CharactersUserDto } from '~/interfaces/characters-user.dto';
import type { EditCharacterDto } from '~/interfaces/edit-character.dto';
import type { JobsDto } from '~/interfaces/jobs-dto';

const props = defineProps({
    showModal: Boolean,
    title: String,
    character: Object as PropType<CharactersUserDto>
});

const emit = defineEmits(['closeModal']);

const missingCharacter = ref<CharacterDto[]>([])
const characterUser = ref<CharactersUserDto[]>([])

const close = (character: CharactersUserDto | undefined, isUpdate=false) => {

  resetForm()
  emit('closeModal', {character, isUpdate:isUpdate });
};


onMounted(async () => {
charactersList.value = await $fetch<CharacterDto[]>(`/api/character/all`)
characterUser.value =  await $fetch<CharactersUserDto[]>(`/api/character-user/all`)

missingCharacter.value = charactersList.value.filter(    (character) => !characterUser.value.some(
        (characterUser) => characterUser.character.id === character.id
))

jobsList.value = await $fetch<JobsDto[]>(`/api/jobs/all`)
  selectedCharacter.value = props.character?.character,
  selectedJob.value = props.character?.job
  form.level = String(props.character?.level)
})

const selectedCharacter = ref<CharacterDto>()
const selectedJob = ref<JobsDto>()
const open = ref(false)

const selectFavoriteGift= (gift:CharacterDto) => {
  selectedCharacter.value = gift
  open.value = false
}

const charactersList = ref<CharacterDto[]>([])
const jobsList = ref<JobsDto[]>([])

const form = reactive({
  name: '',
  level: '',
  checked: false
});

const resetForm = () => {
  selectedJob.value=undefined;
  form.name = '';
  form.level = '';
  form.checked = false;
}

watch(
  () => props.character,
  (newValue, oldValue) => {
    if(newValue){
      console.warn(newValue)

    }
  }
)


const selectJob = (job:JobsDto) => {
  selectedJob.value = job
  open.value = false
}


const send = async () => {

  if(selectedJob.value && selectedCharacter.value){
      const formSend : EditCharacterDto = {
        level: form.level,
        checked: form.checked,
        job: selectedJob.value,
        character: selectedCharacter.value,
    
      }

      if(!props.character){
        const save : CharactersUserDto = await $fetch<CharactersUserDto>('/api/character-user/create', {
          method: 'POST',
          body: formSend
          })

        close(save)

        }else{

          const save : CharactersUserDto = await $fetch<CharactersUserDto>(`/api/character-user/${props.character.id}`, {
            method: 'PATCH',
            body: formSend
          })

          close(save, true)

        }
  }
}
  

</script>