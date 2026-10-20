<template>
    <h1 class="text-lg text-pink font-bold">Jobs</h1>


        <div v-if="auth.user && auth.user.role==='ADMIN'"
            class="flex flex-row-reverse reactive">
            <button class="border flex items-center p-2.5 gap-2 border-gold"
                    @click="openModal('Ajouter un item')">
                    <p class="text-gold">Ajouter</p>
                    <ClientOnly>
                    <Icon name="mdi-light:plus-circle" class="text-gold" size="24"/>
                    </ClientOnly>          
            </button>

            <PopupEditJob :showModal="showModal" 
                                :title="titleModal"
                                v-model:job="selectedJob"
                                @closeModal="handleCloseModal"/>
        </div>
             <SearchBar v-model:elementTable="jobs"
                        type="jobs"/>

            <div class="flex gap-4 flex-wrap justify-around">
        <div v-for="item in jobs"
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
import type { JobsDto } from '~/interfaces/jobs-dto'

definePageMeta({
  layout: 'admin',
})

const auth = useAuthStore()
const showModal = ref(false)
const titleModal = ref('')
const selectedJob= ref<JobsDto>()
const jobs = ref<JobsDto[]>([])

const openModal = (title: string, item?: JobsDto):void =>{
    titleModal.value = title
    selectedJob.value = item   
    showModal.value = true 
}

const handleCloseModal = (item? : JobsDto):void => {
    showModal.value = false
    selectedJob.value = undefined
    
    if (item && item.id) {
            const index = jobs.value.findIndex(
                c => c.id === item.id
            )

            if (index !== -1) {
                jobs.value[index] = item
            } else {
                jobs.value.push(item)
            }

            jobs.value.sort((a, b) => 
                a.name.localeCompare(b.name)
            )
    }
}
</script>