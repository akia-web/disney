<template>
    <h1 class="text-lg text-gold font-bold">Personnages ({{ characters.length }})</h1>

    <div v-if="auth.user">
            <div class="flex flex-row-reverse reactive">  
                        <button class="border flex items-center p-2.5 gap-2 border-gold"
                @click="openModal('Ajouter un personnage')">
                <p class="text-gold">Ajouter</p>
                <ClientOnly>
                <Icon name="mdi-light:plus-circle" class="text-gold" size="24"/>
                </ClientOnly>          
        </button>
            </div>

        <PopupEditCharacter v-if="showModal" 
                            :title="titleModal"
                            v-model:character="selectedCharacter"
                            @closeModal="handleCloseModal($event)"/>

            <SearchBar v-model:elementTable="characters"
                        type="character-user" v-model:resetFilter="resetFilter"/>

        


            <div class="grid grid-cols-[repeat(auto-fill,170px)] justify-center gap-4">
                <div v-for="character in characters"
                    class="border rounded-lg min-w-[150px] bg-white/90 border-gold"
                    @click="openModal('Modification', character)">
                    <div class="flex justify-between bg-card-color pt-2.5 pb-2.5 rounded-tl-lg rounded-tr-lg">
                        <p class="pl-2 text-white font-bold">{{ character.character.name }}</p>
                        <p class="pr-2 text-white font-bold">{{ character.level }}</p>
                    </div>
                
                    <div class="p-2.5 flex flex-col items-center">
                        <img :src="character.character.image" class="w-37.5" alt="">
                    </div>

                    <div class="flex flex-row-reverse mr-2 mb-2">
                        <img :src="character.job.image" class="w-6.25" alt="">
                    </div>
                    
                </div>

            </div>
    </div>

    <div v-else class="h-[80vh] flex justify-center items-center">
        <p class="text-gold text-xl">Connectez-vous pour suivre vos personnages</p>
    </div>


    



</template>
<script lang="ts" setup>
import type { CharactersUserDto } from '~/interfaces/characters-user.dto'

const auth = useAuthStore()
const showModal = ref(false)
const titleModal = ref('')
const characters = ref<CharactersUserDto[]>([])
const selectedCharacter= ref<CharactersUserDto>()
const resetFilter = ref(false)

const openModal = (title: string, character?: CharactersUserDto):void =>{
    titleModal.value = title
    selectedCharacter.value = character   
    showModal.value = true 
}

const handleCloseModal = async (event: any):Promise<void> => {
    showModal.value = false
    selectedCharacter.value = undefined
    console.warn(event)
    if(event.character && event.isUpdate){
     const indexElement =   characters.value.findIndex((element)=> element.character.id === event.character.characterId)
     if(indexElement !== -1){
        if(characters.value[indexElement]!.job.id !== event.character.job.id){
            resetFilter.value = true
        }
        characters.value[indexElement]!.level = event.character.level
     }

    }else if(event.character && !event.isUpdate){
        resetFilter.value = true
    }
   
}

</script>