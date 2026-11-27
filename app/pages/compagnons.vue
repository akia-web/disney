<template>
    <h1 class="text-lg text-gold font-bold">Compagnons</h1>
        <div class="mb-1">
                        <input
                            v-model="searchCompanion"
                            type="text"
                            placeholder="Rechercher un compagnon..."
                            class="border border-gold w-full p-2.5 rounded-lg mt-4 mb-4 placeholder:gold text-card-color bg-white/90"
                        />
        </div>
        
        <input type="checkbox" v-model="form.checked" class="opacity-0">

    <div class="grid grid-cols-[repeat(auto-fill,160px)] justify-center gap-4">
                <div v-for="companion in filteredCompanionSearch"
                    class="border rounded-lg bg-white/90 border-gold">
                    <div class="flex justify-between items-center bg-card-color p-1 rounded-tl-lg min-h-[60px] rounded-tr-lg w-full">
                        <p class="pl-2 text-white font-bold text-xs">{{ companion.name }}</p>

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
                
                    <div class="p-2.5 flex flex-col items-center relative">
                        <p class="absolute top-1 left-1 text-[8px] border-1 bg-white font-semibold border-card-color rounded-full h-[35px] w-[35px] flex items-center justify-center text-center whitespace-pre-line"
                        v-if="companion.game !== GameEnum.BASE_GAME">
                            {{ translateGame(companion.game).replace(' ', '\n') }}
                        </p>
                        <img :src="companion.image" class="w-[100px] h-[100px] object-contain"
                        :class="[companionsUser.some((element)=> element.companion.name === companion.name && element.isObtained)?'opacity-100' : 'opacity-40']" alt="">
                                                              
                        <div class="flex gap-1 items-center justify-center">
                            <img :src="companion.loveImage" class="w-[20px] h-[20px] object-contain"/>
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
                        <p class="text-[10px]">{{ companion.region }}</p>
                        <img v-if="companion.job" :src="companion.job.image" class="w-[20px] h-[20px] object-contain " alt="">
                    </div>
                </div>

            </div>
</template>
<script lang="ts" setup>
import { GameEnum } from '~/enum/game.enum';
import type { CompanionUserDto } from '~/interfaces/companion-user.dto';
import type { CompanionDto } from '~/interfaces/companion.dto';

const companionsUser = ref<CompanionUserDto[]>([])
const companions = ref<CompanionDto[]>([])
const resetFilter = ref(false)
const searchCompanion = ref('')

const form = reactive({
  checked: false
});

const toggleObtained = async (companion : CompanionDto) => {
    const companionIsObtained = companionsUser.value.some((element) => element.companion.id ===companion.id)
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
        .map(a => {
            const dayIndex = days.indexOf(a.day)
            let diff = (dayIndex - currentDay + 7) % 7

            const isAllDay = a.from === a.to

            // 00h en heure de fin correspond à minuit (24h)
            const endTime = a.to === '00' && !isAllDay
                ? 1440
                : Number(a.to) * 60 + 59

            if (diff === 0 && !isAllDay && endTime < currentTime) {
                diff = 7
            }

            return {
                ...a,
                diff,
                fromMinutes: Number(a.from) * 60
            }
        })
        .sort((a, b) => {
            if (a.diff !== b.diff) return a.diff - b.diff
            return a.fromMinutes - b.fromMinutes
        })



    return sorted[0] ? `${sorted[0].diff === 0? `Aujourd'hui`: sorted[0].day} ${sorted[0].diff === 7 ? 'prochain ' : ''} ${sorted[0].from === sorted[0].to ? 'toute la journée': `de ${sorted[0].from}h à ${sorted[0].to}h`}`: null
}

onMounted(async()=>{
   companionsUser.value =  await $fetch('/api/companion-user/all') 
   companions.value = await $fetch('/api/companion/all') 

})

const normalizeText = (text: string) => {
    return text
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
}

const filteredCompanionSearch = computed(() => {
    const search = normalizeText(searchCompanion.value)

    if (!search) return companions.value

    return companions.value.filter(companion =>
        normalizeText(companion.name).includes(search)
    )
})


</script>