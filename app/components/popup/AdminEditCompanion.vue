<template>
    <div class="fixed inset-0 flex items-center justify-center bg-gray-500/80">
        <div class="bg-white rounded shadow w-full md:w-[90%] h-[80%] overflow-y-auto">
            <div class="flex gap-2 items-center justify-between bg-card-color text-white p-4">
                <h1>{{ title }}</h1>
                <ClientOnly>
                <Icon name="ic:baseline-cancel" 
                        size="24"
                        @click="close"/>
                </ClientOnly>   
            </div>
        

            <PopupAdminHoursModal v-if="openHourModal" 
                :availability="selectedAvailability"
                :listDaysNotUsed="listDaysNotUsed"
                class="z-99"
                :title="'Ajouter un horaire'"
                @closeModal="addAvailability($event)"
            />
            <form class="p-4" @submit.prevent="send">
                <UiLabelAndInput v-model:property="form.name"
                                    id="name"
                                    placeholder="Nom"
                                    type="text"
                                    label="Nom"/>

                <div class="flex gap-8 items-center">
                    <UiLabelAndInput v-model:property="form.image"
                    id="image"
                    placeholder="Image"
                    type="text"
                    label="Image"/>
                
                  <img v-if="form.image" :src="form.image" class="self-end w-[50px] mt-1 object-contain" alt="">

                </div>                    

                <UiSelectOptions v-if="jobs && jobs.length > 0"
                  title="Bonus"
                  id="select1"
                  column="image"
                  :selectedOption="form.job" 
                  :table="jobs"
                  @chooseOption="selectJob"
                  :disabled="false"/>


                <div class="mt-4">

                  <label>Jours de présences </label>
                  <div class="flex gap-2 items-center mt-2">
                      <div v-for="availability in form.availabilities" :key="availability.day">
                          <button class="bg-card-color text-white p-3 rounded-lg relative">
                            <p  @click.prevent="selectAvailability(availability)"> {{ availability.day }}: {{ availability.from }} - {{ availability.to }}</p>
                            
                              <ClientOnly>
                              <Icon name="ic:baseline-cancel"
                                  size="16"
                                  class="absolute top-px right-px"
                                  @click.prevent="form.availabilities = form.availabilities.filter(a => a !== availability); listDaysNotUsed.push(availability.day)"/>  
                              </ClientOnly>
                          </button>
                      </div>

                      <button class="min-w-[80px] border border-card-color text-card-color p-2 rounded-lg"
                        @click.prevent="openHourModal = !openHourModal">                      
                      +
                      </button>

                  </div>

                </div>

                    <UiLabelAndInput v-model:property="form.loveName"
                    id="loveName"
                    placeholder="Nom du cadeau"
                    type="text"
                    label="Nom du cadeau"/>


                  <div class="flex gap-8 items-center">
                    <UiLabelAndInput v-model:property="form.loveImage"
                    id="imageLove"
                    placeholder="Url image cadeau"
                    type="text"
                    label="Image Cadeau"/>
                
                  <img v-if="form.image" :src="form.loveImage" class="self-end w-[50px] mt-1 object-contain" alt="">

                </div>    
                  
                <div class="mt-4">
                  <label>Jeu</label>
                  <select v-model="form.game" class="w-full border border-card-color rounded-lg p-2.5">
                    <option disabled value="">Sélectionner un jeu</option>
                    <option v-for="game in games" :key="game" :value="game">{{ game }}</option>
                  </select>
                </div>

                    <UiLabelAndInput v-model:property="form.region"
                    id="region"
                    placeholder="Région"
                    type="text"
                    label="Région"/>
                

                <input type="checkbox" v-model="form.checked" class="opacity-0">

                <div class="text-center">
                  <button type="submit" class="bg-card-color text-white p-4 rounded-lg font-bold">Envoyer</button>
                </div>
                
            </form> 
        </div>
        
    </div>
</template>

<script lang="ts" setup>
import { GameEnum } from '~/enum/game.enum';
import type { CompanionDto } from '~/interfaces/companion.dto';
import type { CompanionAvailabilityDto } from '~/interfaces/companionAvailability.dto';
import type { JobsDto } from '~/interfaces/jobs-dto';

const props = defineProps({
    showModal: Boolean,
    title: String,
    jobs: Array as PropType<JobsDto[]>,
    companion: Object as PropType<CompanionDto>
});

const emit = defineEmits(['closeModal']);

const close = (companion? : CompanionDto) => {
  resetForm()
  emit('closeModal', companion );
};


const openHourModal = ref(false)


const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']
const listDaysNotUsed= ref<string[]>(days)
const games = Object.keys(GameEnum);

const form = reactive({
  name: '',
  image: '',
  loveName: '',
  loveImage: '',
  checked: false,
  region: '',
  game: GameEnum.BASE_GAME,
  job: undefined as JobsDto | undefined,
  availabilities: [] as CompanionAvailabilityDto[],
});

const selectedAvailability = ref<CompanionAvailabilityDto | null>(null)

const resetForm = () => {
  form.name = '';
  form.checked = false;
}

watch(
  () => props.companion,
  (newValue, oldValue) => {
    if(newValue){
      console.log('lolo')
      form.name = newValue.name 
      form.image = newValue.image
      form.job = newValue.job
      form.availabilities= newValue.availabilities
      form.loveName = newValue.loveName
      form.loveImage = newValue.loveImage
      form.region = newValue.region
      form.game = newValue.game
    }
  }, {immediate:true}
)

const selectJob = (item: JobsDto) => {
  form.job = item
}

const addAvailability = (companionAvailability? : CompanionAvailabilityDto):void => {
  openHourModal.value = false
  console.log('companionAvailability', companionAvailability)
  
  if(companionAvailability && companionAvailability.day){
    form.availabilities.push(companionAvailability)
    const usedDays = form.availabilities.map(a => a.day)
    listDaysNotUsed.value = days.filter(day => !usedDays.includes(day))
  }

  selectedAvailability.value = null
}

const selectAvailability = (availability: CompanionAvailabilityDto) => {
  selectedAvailability.value = availability
  openHourModal.value = true
}

const send = async () => {
      const formSend  = {
      name: form.name,
      image: form.image,
      loveName: form.loveName,
      loveImage: form.loveImage,
      checked: form.checked,
      region: form.region,
      game: form.game,
      jobId: form.job?.id,
      availabilities: form.availabilities
    }

  if(props.companion && props.companion.id){
   const save : CompanionDto = await $fetch<CompanionDto>(`/api/admin/companion/${props.companion.id}`, {
      method: 'PATCH',
      body: formSend
    })

    close(save)
  }else{
   const save : CompanionDto = await $fetch<CompanionDto>(`/api/admin/companion/create`, {
      method: 'POST',
      body: formSend
    })

    close(save)
  } 

}

</script>