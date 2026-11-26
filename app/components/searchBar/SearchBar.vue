<template>

  <CharacterJobsFilter v-if="props.type === 'character-user'"
                        :jobsList="jobsList" 
                        v-model:selectedJobCategorie="selectedJobCategorie"
                        @switchCategorie="switchCategorie"/>

    <div>
        <input type="text"
        class="border border-gold w-full p-2.5 rounded-lg mt-4 mb-4 placeholder:gold text-card-color bg-white/90"
        v-model="searchElement"
        placeholder="Rechercher">
    </div>


    <select v-if="props.type === 'character-user'"
            v-model="orderByLevel" 
            class="bg-white/90 mb-4 p-1.5 rounded-lg" 
            v-on:change="orderBy" >
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
import CharacterJobsFilter from './CharacterJobsFilter.vue';

const props = defineProps({
  elementTable: Array as PropType<CharactersUserDto[] | JobsDto[]>,
  type: {
    type: String as PropType<'character' |'character-user' | 'jobs'| 'companion'>,
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
const selectedJobCategorie = ref<JobsDto>()
const orderByLevel = ref<string>('');

const ignoreNextSearch = ref(false)
let timeout: ReturnType<typeof setTimeout>

const switchCategorie = async (job: JobsDto) => {
      clearTimeout(timeout)
      ignoreNextSearch.value = true
    searchElement.value=''
    selectedJobCategorie.value =
        selectedJobCategorie.value?.id === job.id
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
  if(orderByLevel.value && props.type === 'character-user'){
    query.orderByLevel = orderByLevel.value
  }else{
    query.orderByLevel = undefined
  }

  if(selectedJobCategorie.value){
    query.job = String(selectedJobCategorie.value.id)
  }else{
    query.job = undefined
  }

  if(searchElement.value){
    query.search = searchElement.value
  }
    
  elementTable.value = await $fetch<CharacterDto[]>(`/api/${props.type}/all`, {
    query,
  })

    
  jobsList.value = props.type === 'character-user' ?  await $fetch<JobCategorieDto[]>('/api/jobs/count') : []
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
      selectedJobCategorie.value = undefined
      searchElement.value = ''
      await searchApi()
      emit('update:resetFilter', false)

    }

  }
)



</script>