<template>
 <div v-if="auth.user">
        <div class="flex flex-row-reverse reactive">
            <button class="border flex items-center p-2.5 gap-2 border-gold"
                @click="openModal('Ajouter un Dreamsnap')">
                    <p class="text-gold">Ajouter</p>
                    <ClientOnly>
                    <Icon name="mdi-light:plus-circle" class="text-gold" size="24"/>
                    </ClientOnly>          
            </button>

            <PopupEditDreamsnap v-if="showModal"
                            :title="titleModal"
                            v-model:dreamsnap="selectedDreamsnap"
                            @closeModal="handleCloseModal"/>

             <DreamsnapDetail v-if="showDetails"
                            :dreamsnaps="dreamsnaps"
                            :dreamnap="selectedDreamsnap"
                            @closeModal="handleCloseModal"/>
            

        </div>

        
        <div class="grid grid-cols-[repeat(auto-fill,390px)] justify-center gap-4 mt-4">
            <div v-for="dreamsnap in dreamsnaps"
            class="border rounded-lg p-2 text-card-color border-gold bg-white/90">
                <div class="flex justify-between items-center" 
                @click="selectDreamsnap(dreamsnap)">
                    <div>
                        <UiDate :date="dreamsnap.date.toString()"/>
                        <p class="text-sm">#{{ dreamsnap.rank }}</p>
                    </div>
                    <div class="flex gap-2 items-center">
                        <p>{{ dreamsnap.moonlight }}</p>
                        <img src="~/assets/Pierre_de_lune.webp" class="w-3.75 h-3.75">
                    </div>
                    
                </div>
                
                <img :src="dreamsnap.image" 
                    :alt="dreamsnap.theme"
                    @click="selectDreamsnap(dreamsnap)"
                    class="w-full object-contain h-71.25">
                <div class="flex justify-center gap-2 items-center"
                @click="edit(dreamsnap)">
                    <p class="text-lg text-center">{{ dreamsnap.theme }}</p>
                    <ClientOnly>
                        <Icon name="bytesize:edit" 
                                size="16"/>
                    </ClientOnly>   
                </div>
            </div>
        </div>


    </div>

    <div v-else class="h-[80vh] flex justify-center items-center">
        <p class="text-gold text-xl">Connectez-vous pour personnaliser vos Dreamsnap</p>
    </div>

</template>
<script lang="ts" setup>

import type { DreamsnapDto } from '~/interfaces/dreamsnap.dto'

const auth = useAuthStore()
const showModal = ref(false)
const titleModal = ref('')
const dreamsnaps = ref<DreamsnapDto[]>([])
const selectedDreamsnap= ref<DreamsnapDto>()
const showDetails=ref<boolean>(false)
    
onMounted(async ():Promise<void> =>{
    
    if(auth.user){
         dreamsnaps.value = await $fetch<DreamsnapDto[]>('/api/dreamsnap/all')
    }else{
        navigateTo('connexion')
    }
   
})

const openModal = (title: string):void =>{
    titleModal.value = title 
    showModal.value = true 
}

const edit = (dreamsnap:DreamsnapDto):void =>{
    console.log('edit', dreamsnap)
    selectedDreamsnap.value = dreamsnap
    titleModal.value = 'Modifier un Dreamsnap'
    showModal.value = true 
}

const selectDreamsnap = (dreamsnap:DreamsnapDto) => {
    selectedDreamsnap.value = dreamsnap
    showDetails.value =true
}

const handleCloseModal = (dreamsnap? : DreamsnapDto, isDeleted?: boolean):void => {
    showModal.value = false
    selectedDreamsnap.value = undefined
    showDetails.value = false

    if (isDeleted && dreamsnap) {
        const index = dreamsnaps.value .findIndex(
            c => c.id === dreamsnap.id
        )

        if (index !== -1) {
            dreamsnaps.value .splice(index, 1)
        }
    }else if(dreamsnap && dreamsnap.id) {
            const index = dreamsnaps.value .findIndex(
                c => c.id === dreamsnap.id
            )

            if (index !== -1) {
                dreamsnaps.value[index] = dreamsnap
            } else {
                dreamsnaps.value.push(dreamsnap)
            }

        dreamsnaps.value.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )
    }
}
</script>