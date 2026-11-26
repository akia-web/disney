<template>
    <div
    class="fixed inset-0 flex items-center justify-center bg-gray-500/80">
        <div class="bg-white rounded shadow w-[60%]">
            <div class="flex gap-2 items-center justify-between bg-card-color text-white p-4">
                <p>{{ title }}</p>
                
                <ClientOnly>
                <Icon name="ic:baseline-cancel" 
                        size="24"
                        @click="close"/>
                </ClientOnly>   
            </div>
        
            <form class="p-4" @submit.prevent="send">
                <select v-model="form.day" class="w-full border border-card-color rounded-lg p-2.5">
                    <option disabled value="">Sélectionner un jour</option>
                    <option v-for="day in listDaysNotUsed" :key="day" :value="day">{{ day }}</option>
                </select>
                  
                <div class="flex gap-8 justify-center mt-2">
                    <div class="flex gap-1 items-center">
                        <span>De:</span>
                        <select v-model="form.from" class="w-full border border-card-color rounded-lg p-2.5">
                            <option disabled :value="undefined">Sélectionner une heure</option>
                            <option v-for="hour in hours" :key="hour" :value="hour">{{ hour }}h</option>
                        </select>
                    </div>
                    <div class="flex gap-1 items-center">
                        <span>A:</span>
                        <select v-model="form.to" class="w-full border border-card-color rounded-lg p-2.5">
                            <option disabled :value="undefined">Sélectionner une heure</option>
                            <option v-for="hour in hours" :key="hour" :value="hour">{{ hour }}h</option>
                        </select>
                    </div>

                </div>


         
                

                <div class="text-center">
                  <button type="submit" class="bg-card-color text-white p-4 rounded-lg font-bold">valider</button>
                </div>
                
            </form> 
        </div>
        
    </div>
</template>
<script lang="ts" setup>
import type { CompanionAvailabilityDto } from '~/interfaces/companionAvailability.dto';


    const props = defineProps({
    title: String,
    listDaysNotUsed: Array as PropType<string[]>,
    availability: Object as PropType<CompanionAvailabilityDto | null>
    });

    const emit = defineEmits(['closeModal']);


    const form = reactive({
        day: '',
        from: '',
        to: '',
    })

    const hours=['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23']


    const send = () => {
        if(form.day && form.from && form.to){
            close(form)
        }
    }

    const close = (companionAvailability? : CompanionAvailabilityDto) => {
        emit('closeModal', companionAvailability );
    };

    watch(
  () => props.availability,
  (newValue, oldValue) => {
    if(newValue){
      form.day = newValue.day
      form.from = newValue.from
      form.to = newValue.to
    }
  }, {immediate: true}
)

</script>