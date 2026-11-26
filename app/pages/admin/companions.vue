<template>
    <h1 class="text-lg text-pink font-bold">Compagnons</h1>


        <div v-if="auth.user && auth.user.role==='ADMIN'"
            class="flex flex-row-reverse reactive">
            <button class="border flex items-center p-2.5 gap-2 border-gold"
                    @click="openModal('Ajouter un compagnon')">
                    <p class="text-gold">Ajouter</p>
                    <ClientOnly>
                    <Icon name="mdi-light:plus-circle" class="text-gold" size="24"/>
                    </ClientOnly>          
            </button>

            <AdminEditCompanion v-if="showModal"
                                :title="titleModal"
                                :companion="selectedCompanion"
                               :jobs="jobs"
                                @closeModal="handleCloseModal"/>
        </div>
             <SearchBar v-model:elementTable="companions"
                        type="companion"/>

            <div class="flex gap-4 flex-wrap justify-around">
        <div v-for="item in companions"
            class="border rounded-lg min-w-50 max-w-50 bg-white"
            @click="openModal('Modification', item)">
            <div class="flex justify-center p-2.5 rounded-tl-lg rounded-tr-lg">
                <p class="text-pink font-bold">{{ item.name }}</p>
            </div>
           
            <div class="p-2.5 flex flex-col items-center">
                <img :src="item.image" class="w-6.25" alt="">
            </div>
            
        </div>

    </div>
</template>
<script lang=ts setup>
import AdminEditCompanion from '~/components/popup/AdminEditCompanion.vue'
import type { CompanionDto } from '~/interfaces/companion.dto'
import type { JobsDto } from '~/interfaces/jobs-dto'

definePageMeta({
  layout: 'admin',
})

const auth = useAuthStore()
const showModal = ref(false)
const titleModal = ref('')
const selectedCompanion= ref<CompanionDto>()
const jobs = ref<JobsDto[]>([])
const companions = ref<CompanionDto[]>([])

const openModal = (title: string, item?: CompanionDto):void => {
    titleModal.value = title
    selectedCompanion.value = item  
    showModal.value = true 
}

const handleCloseModal = (item? : CompanionDto):void => {
    showModal.value = false
    selectedCompanion.value = undefined
    
    if (item && item.id) {
            const index = companions.value.findIndex(
                c => c.id === item.id
            )

            if (index !== -1) {
                companions.value[index] = item
            } else {
                companions.value.push(item)
            }

            companions.value.sort((a, b) => 
                a.name.localeCompare(b.name)
            )
    }
}


onMounted(async () => {
    try {
        const response = await $fetch('/api/jobs/all')
        jobs.value = response as JobsDto[]
    } catch (error) {
        console.error('Erreur lors de la récupération des jobs:', error)
    }
})
</script>