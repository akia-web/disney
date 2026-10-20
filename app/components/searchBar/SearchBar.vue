<template>
<div class="flex gap-4 flex-wrap mt-4">
        <button v-for="jobCategorie in jobsList"
                        class="flex gap-2 border border-gold rounded-lg p-2"
                        :class="{'bg-white':selectedCategorie && selectedCategorie.name === jobCategorie.name,
                        }"
                        @click="switchCategorie(jobCategorie)">
            <img :src="jobCategorie.image" 
                :alt="jobCategorie.name"
                class="w-6.25 rounded-full p-1 bg-white">
            <span class="hidden md:block" :class="{'text-card-color':selectedCategorie && selectedCategorie.name === jobCategorie.name, 
                            'text-gold': !selectedCategorie || (selectedCategorie && selectedCategorie.name !== jobCategorie.name)
                        }">
                     {{ jobCategorie.name }}
            </span>
            <span :class="{'text-card-color':selectedCategorie && selectedCategorie.name === jobCategorie.name, 
                            'text-gold': !selectedCategorie || (selectedCategorie && selectedCategorie.name !== jobCategorie.name)
                        }">({{ jobCategorie.number }})</span>
        </button>
    </div>

    <div>
        <input type="text"
        class="border border-gold w-full p-2.5 rounded-lg mt-4 mb-4 placeholder:gold text-card-color bg-white/90"
        v-model="searchElement"
        placeholder="Rechercher">
    </div>
</template>

<script lang="ts" setup>

import type { PropType } from 'vue'
import type { CharacterDto } from '~/interfaces/characters-dto'
import type { CharactersUserDto } from '~/interfaces/characters-user.dto';
import type { JobCategorieDto } from '~/interfaces/job-categorie.dto';
import type { JobsDto } from '~/interfaces/jobs-dto';

const props = defineProps({
  elementTable: Array as PropType<CharactersUserDto[] | JobsDto[]>,
  type: {
    type: String as PropType<'character' |'character-user' | 'jobs'| 'visitor-user'>,
    required: true
  }
})

const emit = defineEmits([
  'update:elementTable'
])

const searchElement = ref('')
const jobsList = ref<JobCategorieDto[]>([])
const selectedCategorie = ref<JobsDto>()

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

    await searchApi(
        selectedCategorie.value
            ? { job: String(selectedCategorie.value.id) }
            : {}
    )
}

const elementTable = computed({
  get: () => props.elementTable,
  set: value => emit(`update:elementTable`, value)
})

const searchApi = async (query?: {}) => {
  console.warn(props.type)
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

watch(searchElement, (newValue) => {
    if (ignoreNextSearch.value) {
        ignoreNextSearch.value = false
        return
    }

    clearTimeout(timeout)

    timeout = setTimeout(async () => {
        await searchApi(
            newValue
                ? { search: newValue }
                : undefined
        )
    }, 200)
})

</script>