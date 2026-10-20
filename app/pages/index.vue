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

            <PopupEditDreamsnap :showModal="showModal" 
                            :title="titleModal"
                            v-model:dreamsnap="selectedDreamsnap"
                            @closeModal="handleCloseModal"/>

        </div>

        
        <div class="grid grid-cols-[repeat(auto-fill,400px)] justify-center gap-4 mt-4">
            <div v-for="dreamsnap in dreamsnaps"
            class="border rounded-lg p-2 text-card-color border-gold bg-white/90">
                <div class="flex justify-between items-center">
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
                    class="w-full object-contain h-71.25">
                <div>
                    <p class="text-lg text-center">{{ dreamsnap.theme }}</p>
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

    
onMounted(async ():Promise<void> =>{
    if(auth.user){
         dreamsnaps.value = await $fetch<DreamsnapDto[]>('/api/dreamsnap/all')
    }
   
})

const openModal = (title: string, dreamsnap?: DreamsnapDto):void =>{
    titleModal.value = title
    selectedDreamsnap.value = dreamsnap   
    showModal.value = true 
}

const handleCloseModal = (dreamsnap? : DreamsnapDto):void => {
    showModal.value = false
    selectedDreamsnap.value = undefined
    
    if (dreamsnap && dreamsnap.id) {
            const index = dreamsnaps.value.findIndex(
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