<template>
    <div class="flex gap-4 flex-wrap mt-4">
        <button v-for="jobCategorie in jobsCategories"
                        class="flex gap-2 border border-card-color rounded-lg p-2"
                        :class="{'bg-gold':selectedCategorie === jobCategorie.job,
                            'border-gold': selectedCategorie === jobCategorie.job 
                        }"
                        @click="switchCategorie(jobCategorie.job)">
            <img v-if="jobsIcones" :src="getJobIcon(jobsIcones,jobCategorie.job)" 
                :alt="jobCategorie.job"
                class="w-6.25 rounded-full p-1 bg-white">
            <div>{{ jobCategorie.job }}</div>
            <div>{{ jobCategorie.number }}</div>
        </button>
    </div>

    <div>
        <input type="text"
        class="border w-full p-2.5 rounded-lg mt-4 mb-4"
        v-model="searchCharacter"
        placeholder="Rechercher">
    </div>
</template>
<script lang="ts" setup>
import type { PropType } from 'vue';
import type { CharacterDto } from '~/interfaces/characters-dto';
import type { JobCategorieDto } from '~/interfaces/job-categorie.dto';
import type { JobsDto } from '~/interfaces/jobs-dto';
import getJobIcon from '~/utils/getIconJob';

const props = defineProps({
    characters: Array as PropType<CharacterDto[]>,
    jobsIcones: Array as PropType<JobsDto[]>
});

const selectedCategorie = ref()
const jobsCategories = ref<JobCategorieDto[]>([])
const searchCharacter = ref();
let timeout: ReturnType<typeof setTimeout>

onMounted(async ()=>{
    await searchApi()
     jobsCategories.value = await $fetch<JobCategorieDto[]>('/api/jobs/count')
})

onBeforeUnmount(() => {
  clearTimeout(timeout)
})

const emit = defineEmits(['update:characters']);

const characters = computed({
    get: () => props.characters,
    set: value => emit('update:characters', value)
});

const searchApi = async (query?:{}) =>{
 characters.value = await  $fetch('/api/character/all', {query})
}

const switchCategorie = async (job: string) => {
    searchCharacter.value=undefined
    selectedCategorie.value =selectedCategorie.value === job? undefined : job;
    
    await searchApi(selectedCategorie.value? {
        job: job
      }: undefined)

}

watch(searchCharacter, (newValue) => {
    if(newValue){
        clearTimeout(timeout)
        selectedCategorie.value = undefined
        timeout = setTimeout(async () => {
            await searchApi({search: newValue})
        }, 200)
    }
})


</script>