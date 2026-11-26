<template>
    <h1 class="text-lg text-gold font-bold">Compagnons</h1>
        <SearchBar v-model:elementTable="companions"
                type="companion" v-model:resetFilter="resetFilter"/>
        
        <input type="checkbox" v-model="form.checked" class="opacity-0">

    <div class="grid grid-cols-[repeat(auto-fill,160px)] justify-center gap-4">
                <div v-for="companion in companions"
                    class="border rounded-lg min-w-37.5 bg-white/90 border-gold">
                    <div class="flex justify-between items-center bg-card-color p2.5 rounded-tl-lg rounded-tr-lg">
                        <p class="pl-2 text-white font-bold">{{ companion.name }}</p>

                        <div>
                            <ClientOnly @click="toggleObtained(companion)">
                                 <Icon v-if="companionsUser.some((element)=> element.companion.name === companion.name && element.isObtained)"
                                        name="andrsrxn:heart-filled"  
                                        class=" cursor-pointer pr-2 text-red-800"
                                        size="25"/>
                                 <Icon v-else
                                        name="andrsrxn:heart"  
                                        class=" cursor-pointer pr-2 text-light-grey"
                                        size="25"/>
                        </ClientOnly>
                        </div>

                    </div>
                
                    <div class="p-2.5 flex flex-col items-center">
                        <img :src="companion.image" class="w-[100px]"
                        :class="[companionsUser.some((element)=> element.companion.name === companion.name && element.isObtained)?'opacity-100' : 'opacity-40']" alt="">
                                                              
                    <div class="flex gap-1 items-center justify-center">
                            <img :src="companion.loveImage" class="w-[25px]"/>
                            <p class="text-xs">{{ companion.loveName }}</p>
                    </div>
                        <div v-if="companion.availabilities">
                            <p class="text-xs underline text-center">Prochaine apparition</p>
                            <div class="text-[10px] flex gap-1 items-center">
                                <ClientOnly>
                                    <Icon name="basil:arrow-right-outline" size="10"/>
                                </ClientOnly>
                             <p> {{ getNextAvailability(companion.availabilities) }}
                            </p>
                            </div>
                        </div>
                    </div>
                    

                    <div class="flex justify-between items-center mr-2 ml-2 mb-1">
                        <p class="text-xs">{{ companion.region }}</p>
                        <img v-if="companion.job" :src="companion.job.image" class="w-[20px]" alt="">
                    </div>
                </div>

            </div>
</template>
<script lang="ts" setup>
import type { CompanionUserDto } from '~/interfaces/companion-user.dto';
import type { CompanionDto } from '~/interfaces/companion.dto';

const companionsUser = ref<CompanionUserDto[]>([])
const companions = ref<CompanionDto[]>([])
const resetFilter = ref(false)

const form = reactive({
  checked: false
});

const toggleObtained = async (companion : CompanionDto) => {
    const companionIsObtained = companionsUser.value.some((element) => element.companion.id ===companion.id)
    console.log(companionIsObtained)
    if(!companionIsObtained){
        const save : CompanionUserDto = await $fetch<CompanionUserDto>('/api/companion-user/create', {
        method: 'POST',
        body: {
            companionId: companion.id,
            checked: form.checked
        }
        })
        companionsUser.value.push(save)
    }else{
         const save : CompanionUserDto = await $fetch<CompanionUserDto>(`/api/companion-user/${companion.id}`, {
        method: 'DELETE',
        body: {
            checked: form.checked
        }
        })

        companionsUser.value = companionsUser.value.filter((element)=> element.companion.id !== companion.id)
    }
}

const getNextAvailability = (availabilities: { day: string, from: string, to: string }[]) => {
    const days = [
        'Dimanche',
        'Lundi',
        'Mardi',
        'Mercredi',
        'Jeudi',
        'Vendredi',
        'Samedi'
    ]

    const now = new Date()
    const currentDay = now.getDay()
    const currentTime = now.getHours() * 60 + now.getMinutes()

const sorted = availabilities
    .map(a => ({
        ...a,
        dayIndex: days.indexOf(a.day),
        fromMinutes: Number(a.from) * 60
    }))
    .map(a => ({
        ...a,
        diff: (a.dayIndex - currentDay + 7) % 7
    }))
    .map(a => ({
        ...a,
        diff: a.diff === 0 ? 7 : a.diff
    }))
    .filter(a =>
        a.diff > 0 ||
        (
            a.diff === 0 &&
            (
                a.from === a.to ||
                Number(a.to) * 60 + 59 >= currentTime
            )
        )
    )
    .sort((a, b) => {
        if (a.diff !== b.diff) return a.diff - b.diff
        return a.fromMinutes - b.fromMinutes
    })

    return sorted[0] ? `${sorted[0].day} ${sorted[0].diff === 7 ? 'prochain ' : ''} ${sorted[0].from === sorted[0].to ? 'toute la journée': `de ${sorted[0].from}h à ${sorted[0].to}h`}`: null
}

onMounted(async()=>{
   companionsUser.value =  await $fetch('/api/companion-user/all') 
})
</script>