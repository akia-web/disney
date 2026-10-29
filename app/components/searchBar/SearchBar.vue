<template>
<div class="flex gap-4 flex-wrap mt-4">
        <button v-for="jobCategorie in jobsList"
              class="border border-gold rounded-lg p-1 md:min-w-32.5"
              :class="{'bg-white':selectedCategorie && selectedCategorie.name === jobCategorie.name,
              }"
              @click="switchCategorie(jobCategorie)">
          <div class="flex gap-2 items-center justify-center">
            <img :src="jobCategorie.image" 
                  :alt="jobCategorie.name"
                  class="w-6.25 rounded-full p-1 bg-white">
            <span class="hidden md:block text-xs font-semibold" :class="{'text-card-color':selectedCategorie && selectedCategorie.name === jobCategorie.name, 
                            'text-gold': !selectedCategorie || (selectedCategorie && selectedCategorie.name !== jobCategorie.name)
                        }">
                      {{ jobCategorie.name }}
            </span>
            <span   class="text-xs font-semibold"
                    :class="{'text-card-color':selectedCategorie && selectedCategorie.name === jobCategorie.name, 
                            'text-gold': !selectedCategorie || (selectedCategorie && selectedCategorie.name !== jobCategorie.name)
                        }">({{ jobCategorie.number }})
            </span>
            <p class="text-xs italic md:hidden"
            :class="{'text-card-color':selectedCategorie && selectedCategorie.name === jobCategorie.name, 
                            'text-gold': !selectedCategorie || (selectedCategorie && selectedCategorie.name !== jobCategorie.name)
                        }"
            >{{ getBonus(jobCategorie.name, Number(jobCategorie.number)) }}</p>
          </div>
        
          <p class=" text-xs italic hidden md:block md:mt-1"
          :class="{'text-card-color':selectedCategorie && selectedCategorie.name === jobCategorie.name, 
                            'text-gold': !selectedCategorie || (selectedCategorie && selectedCategorie.name !== jobCategorie.name)
                        }">{{ getBonus(jobCategorie.name, Number(jobCategorie.number)) }}</p>
        </button>
    </div>

    <div>
        <input type="text"
        class="border border-gold w-full p-2.5 rounded-lg mt-4 mb-4 placeholder:gold text-card-color bg-white/90"
        v-model="searchElement"
        placeholder="Rechercher">
    </div>

    <select v-model="orderByLevel" class="bg-white/90 mb-4 p-1.5 rounded-lg" v-on:change="orderBy" >
      <option value="">Aucun filtre de niveaux</option>
      <option value="smallest">Du plus petit niveau au plus grand</option>
      <option value="bigest">Du plus grand niveau au plus petit</option>
    </select>
</template>

<script lang="ts" setup>

import type { PropType } from 'vue'
import type { CharacterDto } from '~/interfaces/characters-dto';
import type { CharactersUserDto } from '~/interfaces/characters-user.dto';
import type { JobCategorieDto } from '~/interfaces/job-categorie.dto';
import type { JobsDto } from '~/interfaces/jobs-dto';

const props = defineProps({
  elementTable: Array as PropType<CharactersUserDto[] | JobsDto[]>,
  type: {
    type: String as PropType<'character' |'character-user' | 'jobs'| 'visitor-user'>,
    required: true
  },
  resetFilter: Boolean
})

const orderBy = async () => {
  await searchApi()
}

const emit = defineEmits([
  'update:elementTable',
  'update:resetFilter'
])

const searchElement = ref('')
const jobsList = ref<JobCategorieDto[]>([])
const selectedCategorie = ref<JobsDto>()
const orderByLevel = ref<string>('');

const ignoreNextSearch = ref(false)
let timeout: ReturnType<typeof setTimeout>

const switchCategorie = async (job: JobsDto) => {
      clearTimeout(timeout)
      ignoreNextSearch.value = true
    searchElement.value=''
    selectedCategorie.value =
        selectedCategorie.value?.id === job.id
            ? undefined
            : job

    await searchApi()
}

const elementTable = computed({
  get: () => props.elementTable,
  set: value => emit(`update:elementTable`, value)
})

const searchApi = async () => {
  const query: Record<string, any> = {}
  if(orderByLevel.value){
    query.orderByLevel = orderByLevel.value
  }

  if(selectedCategorie.value){
    query.job = String(selectedCategorie.value.id)
  }

  if(searchElement.value){
    query.search = searchElement.value
  }
    
    elementTable.value = await $fetch<CharacterDto[]>(`/api/${props.type}/all`, {
      query,
    })

    jobsList.value = await $fetch('/api/jobs/count')
}

onMounted(async () => {
  await searchApi()
})

onBeforeUnmount(() => {
  clearTimeout(timeout)
})

watch(searchElement, () => {
    if (ignoreNextSearch.value) {
        ignoreNextSearch.value = false
        return
    }

    clearTimeout(timeout)

    timeout = setTimeout(async () => {
        await searchApi()
    }, 200)
})


watch(
  () => props.resetFilter,
  async (newValue) => {
    if(newValue){
      console.warn('je reset')
      selectedCategorie.value = undefined
      searchElement.value = ''
      await searchApi()
      emit('update:resetFilter', false)

    }

  }
)

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