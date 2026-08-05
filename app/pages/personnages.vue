<template>
    Personnages

    <div v-if="auth.user && auth.user.role==='ADMIN'"
            class="flex flex-row-reverse reactive">
        <button class="border flex items-center p-2.5 gap-2"
                @click="openModal('Ajouter un personnage')">
                <p>Ajouter</p>
                <ClientOnly>
                <Icon name="mdi-light:plus-circle" size="24"/>
                </ClientOnly>          
        </button>

        <PopupEditCharacter :showModal="showModal" 
                            :title="titleModal"
                            :jobs="jobsIcons"
                            v-model:character="selectedCharacter"
                            @closeModal="handleCloseModal"/>
    </div>

    <CharacterSearchBar v-model:characters="characters"
                        :jobsIcones="jobsIcons"/>


    <div class="flex gap-4 flex-wrap justify-around after:flex-auto">
        <div v-for="character in characters"
            class="border rounded-lg min-w-50"
            @click="openModal('Modification', character)">
            <div class="flex justify-between bg-card-color pt-2.5 pb-2.5 rounded-tl-lg rounded-tr-lg">
                <p class="pl-2 text-white font-bold">{{ character.name }}</p>
                <p class="pr-2 text-white font-bold">{{ character.level }}</p>
            </div>
           
            <div class="p-2.5 flex flex-col items-center">
                <img :src="character.image" class="w-37.5" alt="">
            </div>

            <div class="flex flex-row-reverse mr-2 mb-2">
                <img :src="getJobIcon(jobsIcons, character.job)" class="w-6.25" alt="">
            </div>
            
        </div>

    </div>
    



</template>
<script lang="ts" setup>
import CharacterSearchBar from '~/components/searchBar/CharacterSearchBar.vue'
import type { CharacterDto } from '~/interfaces/characters-dto'
import type { JobsDto } from '~/interfaces/jobs-dto'
import getJobIcon from '~/utils/getIconJob'

const auth = useAuthStore()
const showModal = ref(false)
const titleModal = ref('')
const characters = ref<CharacterDto[]>([])
const selectedCharacter= ref<CharacterDto>()
const jobsIcons = ref<JobsDto[]>([])

const openModal = (title: string, character?: CharacterDto):void =>{
    titleModal.value = title
    selectedCharacter.value = character   
    showModal.value = true 
}

const handleCloseModal = (character? : CharacterDto):void => {
    showModal.value = false
    selectedCharacter.value = undefined
    
    if (character && character.id) {
            const index = characters.value.findIndex(
                c => c.id === character.id
            )

            if (index !== -1) {
                characters.value[index] = character
            } else {
                characters.value.push(character)
            }

            characters.value.sort((a, b) => 
                a.name.localeCompare(b.name)
            )
    }
}

onMounted(async ():Promise<void> =>{
    jobsIcons.value = await $fetch<{ name: string; url: string }[]>('/api/cloudinary/jobs')
})

</script>