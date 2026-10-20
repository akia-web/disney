<template>
    <div class="flex gap-4 flex-wrap mt-4">
        <button v-for="jobCategorie in jobsCategories"
                        class="flex gap-2 border border-gold rounded-lg p-2"
                        :class="{'bg-white':selectedCategorie === jobCategorie.name,
                        }"
                        @click="switchCategorie(jobCategorie.name)">
            <img v-if="jobsIcones" :src="getJobIcon(jobsIcones,jobCategorie.name)" 
                :alt="jobCategorie.name"
                class="w-6.25 rounded-full p-1 bg-white">
            <span class="hidden md:block" :class="{'text-card-color':selectedCategorie === jobCategorie.name, 
                            'text-gold': selectedCategorie !== jobCategorie.name
                        }">
                     {{ jobCategorie.name }}
            </span>
            <span :class="{'text-card-color':selectedCategorie === jobCategorie.name, 
                            'text-gold': selectedCategorie !== jobCategorie.name
                        }">({{ jobCategorie.number }})</span>
        </button>
    </div>

    <div>
        <input type="text"
        class="border border-gold w-full p-2.5 rounded-lg mt-4 mb-4 placeholder:gold text-card-color bg-white/90"
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
 characters.value = await  $fetch<CharacterDto[]>('/api/character/all', {query})
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