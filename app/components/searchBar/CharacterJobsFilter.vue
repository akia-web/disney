<template>
    <div class="flex gap-4 flex-wrap mt-4">
        <button v-for="jobCategorie in jobsList"
              class="border border-gold rounded-lg p-1 md:min-w-32.5"
              :class="{'bg-white':selectedJobCategorie && selectedJobCategorie.name === jobCategorie.name,
              }"
              @click="switchCategorie(jobCategorie)">
          <div class="flex gap-2 items-center justify-center">
            <img :src="jobCategorie.image" 
                  :alt="jobCategorie.name"
                  class="w-6.25 rounded-full p-1 bg-white">
            <span class="hidden md:block text-xs font-semibold" :class="{'text-card-color':selectedJobCategorie && selectedJobCategorie.name === jobCategorie.name, 
                            'text-gold': !selectedJobCategorie || (selectedJobCategorie && selectedJobCategorie.name !== jobCategorie.name)
                        }">
                      {{ jobCategorie.name }}
            </span>
            <span   class="text-xs font-semibold"
                    :class="{'text-card-color':selectedJobCategorie && selectedJobCategorie.name === jobCategorie.name, 
                            'text-gold': !selectedJobCategorie || (selectedJobCategorie && selectedJobCategorie.name !== jobCategorie.name)
                        }">({{ jobCategorie.number }})
            </span>
            <p class="text-xs italic md:hidden"
            :class="{'text-card-color':selectedJobCategorie && selectedJobCategorie.name === jobCategorie.name, 
                            'text-gold': !selectedJobCategorie || (selectedJobCategorie && selectedJobCategorie.name !== jobCategorie.name)
                        }"
            >{{ getBonus(jobCategorie.name, Number(jobCategorie.number)) }}</p>
          </div>
        
          <p class=" text-xs italic hidden md:block md:mt-1"
          :class="{'text-card-color':selectedJobCategorie && selectedJobCategorie.name === jobCategorie.name, 
                            'text-gold': !selectedJobCategorie || (selectedJobCategorie && selectedJobCategorie.name !== jobCategorie.name)
                        }">{{ getBonus(jobCategorie.name, Number(jobCategorie.number)) }}</p>
        </button>
    </div>
</template>
<script lang="ts" setup>
import type { PropType } from 'vue';
import type { JobCategorieDto } from '~/interfaces/job-categorie.dto';
import type { JobsDto } from '~/interfaces/jobs-dto';

const props = defineProps({
    jobsList: Array as PropType<JobCategorieDto[]>,
    selectedJobCategorie: Object as PropType<JobsDto>
});


const jobsCategories = ref<JobCategorieDto[]>([])

onMounted(async ()=>{
     jobsCategories.value = await $fetch<JobCategorieDto[]>('/api/jobs/count')
})

const emit = defineEmits(['switchCategorie']);



const switchCategorie = async (job: JobCategorieDto) => {
    emit('switchCategorie', job)

}

const getBonus = (job:string, number:number) => {
      const bonuses = [
    '+1',
    '+4',
    '+9',
    '+16',
    '+25',
    '+36',
    '+42'
  ];

  if(job !== 'Jardinage' && job !== 'Courbage Temporel'){
    if (number < 5){
      return 'Bonus : +0';
    } 

    const index = Math.floor((number - 5) / 10);
    const remainder = (number - 5) % 10;

    if (remainder === 0) {
      return `Bonus : ${bonuses[index] ?? '+42'}`;
    }

    if (number >= 66){
      return 'Bonus : +36 ou +42';
    } 

    return `Bonus : ${bonuses[index]} ou ${bonuses[index + 1]}`;

  }else if(job === 'Jardinage'){
    if (number < 6){
    return 'Bonus : +0';
    } 

    const index = Math.floor((number - 6) / 10);
    const remainder = (number - 6) % 10;

    if (remainder === 0) {
      return  `Bonus : ${bonuses[index] ?? '+42'}`;
    }

    if (number >= 67) {
      return 'Bonus : +36 ou +42';
    }

    return `Bonus : ${bonuses[index]} ou ${bonuses[index + 1]}`;
  }else{
    return '/'
  }

}
</script>