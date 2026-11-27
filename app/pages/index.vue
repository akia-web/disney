<template>
    <div v-if="auth.user" class="flex gap-6 flex-wrap mt-5">
        <div class="bg-white w-full md:w-[40%] p-5 rounded-lg md:max-h-[90vh]">
            <h1 class="text-center text-xl">Liste de tâches</h1>

        <div class="flex flex-col gap-2 mt-4">
            <div class="flex gap-2 items-center">
                <label for="task">Nouvelle tâche <span class="italic text-xs">(appuyez sur la touche entrer pour confirmer)</span></label>
            </div>
            
            <input v-model="form.description" 
                type="text" 
                id="task" 
                class="border p-2.5 rounded-lg" 
                placeholder="Tâche"
                @keyup.enter="createTask">
        </div>

        <div v-if="tasks.length>0" class="mt-4">
            <ul>
                <li v-for="task in tasks">
                    <div class="flex gap-2 items-center">
                        <div class="relative h-5 w-5 shrink-0">
                            <input
                                type="checkbox"
                                class="h-5 w-5 appearance-none rounded-full border-2 border-gray-400 checked:bg-card-color checked:border-card-color cursor-pointer"
                                v-model="task.isCompleted"
                                v-on:change="updateTask(task)"
                            />
                            <span
                                v-if="task.isCompleted"
                                class="absolute inset-0 flex items-center justify-center text-white pointer-events-none"
                            >
                                <ClientOnly>
                                    <Icon name="akar-icons:check" />
                                </ClientOnly>   
                            </span>
                        </div>

                        <p :class="{ 'line-through decoration-solid decoration-card-color decoration-2': task.isCompleted }">
                            {{ task.description }}
                        </p>

                            <ClientOnly>
                                <Icon name="akar-icons:trash-can" @click="deleteTask(task)" />
                            </ClientOnly>   
                    </div>
                </li>
            </ul>

        </div>
        <div v-else class="mt-4">
            <p>Aucune tache en cours</p>
        </div>

        </div>

        <div class="w-full md:w-[55%]">
            <h2 class="text-center text-white mb-4 text-xl p-5">Présents aujourd'hui</h2>
            <div class="mb-1">
                <input
                    v-model="searchCompanion"
                    type="text"
                    placeholder="Rechercher un compagnon..."
                    class="border border-gold w-full p-2.5 rounded-lg mt-4 mb-4 placeholder:gold text-card-color bg-white/90"
                />
            </div>
                
                <UiMultiSelectOption
                    v-model="selectedGame"
                    placeholder="Tous les jeux"
                    id="game"
                    :table="typeGame"
                    @change="filtrerCompanion"
                />


            <div class="grid grid-cols-[repeat(auto-fill,160px)] justify-center gap-4 mt-4">
                <div v-for="companion in filteredCompanionSearch"
                    class="border rounded-lg bg-white/90 border-gold">
                    <div class="flex justify-between items-center bg-card-color rounded-tl-lg rounded-tr-lg w-full">
                        <p class="pl-2 text-white font-bold">{{ companion.name }}</p>

                        <div>
                            <ClientOnly @click="toggleObtained(companion.id)">
                                 <Icon v-if="companonUser.some((element)=> element.companion.name === companion.name && element.isObtained)"
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
                        :class="[companonUser.some((element)=> element.companion.name === companion.name && element.isObtained)?'opacity-100' : 'opacity-40']" alt="">
                        <div class="flex gap-1 items-center justify-center mt-2">
                            <img :src="companion.loveImage" class="w-[25px]"/>
                            <p class="text-xs">{{ companion.loveName }}</p>
                        </div>
                        <p class="text-center text-xs font-semibold mt-2">{{ companion.presence.from === companion.presence.to? 'Toute la journée': `${companion.presence.from}h à ${companion.presence.to}h` }}</p>

                    </div>
                            
                    <div class="flex justify-between items-center mr-2 ml-2 mb-1">
                        <p class="text-[10px]">{{ companion.region }}</p>
                        <img v-if="companion.job" :src="companion.job" class="w-[20px]" alt="">
                    </div>
                        
            </div>
            </div>
        </div>
       
        
    </div>

</template>
<script lang="ts" setup>
import { GameEnum } from '~/enum/game.enum';
import type { CompanionUserDto } from '~/interfaces/companion-user.dto';
import type { CompanionDto } from '~/interfaces/companion.dto';
import type { taskDto } from '~/interfaces/task.dto';

interface FilteredCompanionDto{
    name: string;
    presence: {day: string, from: string, to: string};
    loveName: string;
    loveImage: string;
    region: string;
    image: string;
    job: string
    id?:number;
    game: GameEnum
}

const typeAnimals = ["Lapin", "Écureuil", "Tortue", "Passereau", "Raton laveur", "Renard", "Corbeau", "Crocodile", "Singe", "Cobra", "Capybara", "Hibou", "Bébé dragon", "Pégase", "Oie", "Mouffette", "Abeille", "Hérission"  ]
const typeGame = Object.keys(GameEnum);
const selectedTypeAnimal= ref<string[]>([])
const selectedGame=ref<string[]>([])

const auth = useAuthStore()
const tasks = ref<taskDto[]>([])
const toast = useToast()

const companonsList = ref<CompanionDto[]>([])
const companonUser = ref<CompanionUserDto[]>([])
const companonFiltered = ref<FilteredCompanionDto[]>([])

const form = reactive({
  description: '',
  checked: false
});

const searchCompanion = ref('')
    
onMounted(async ():Promise<void> =>{
    if(auth.user){
         tasks.value = await $fetch<taskDto[]>('/api/task/all')
         companonsList.value = await $fetch<CompanionDto[]>('/api/companion/all')
         companonUser.value = await $fetch<CompanionUserDto[]>('/api/companion-user/all')
         typeAnimals.sort((a, b) =>a.localeCompare(b, 'fr'))
    }else{
        navigateTo('connexion')
    }

   filtrerCompanion()
   
})

const toggleObtained = async (companionId? : number) => {
    const companionIsObtained = companonUser.value.some((element) => element.companion.id ===companionId)
    if(!companionIsObtained){
        const save : CompanionUserDto = await $fetch<CompanionUserDto>('/api/companion-user/create', {
        method: 'POST',
        body: {
            companionId: companionId,
            checked: form.checked
        }
        })
        companonUser.value.push(save)
    }else{
        await $fetch<CompanionUserDto>(`/api/companion-user/${companionId}`, {
        method: 'DELETE',
        body: {
            checked: form.checked
        }
        })

        companonUser.value = companonUser.value.filter((element)=> element.companion.id !== companionId)
    }
}

const normalizeText = (text: string) => {
    return text
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
}

const filteredCompanionSearch = computed(() => {
    const search = normalizeText(searchCompanion.value)

    if (!search) return companonFiltered.value

    return companonFiltered.value.filter(companion =>
        normalizeText(companion.name).includes(search)
    )
})




const filtrerCompanion = () => {
    companonFiltered.value = []

    const today = new Date().toLocaleDateString('fr-FR', {
        weekday: 'long'
    })

    const todayCapitalized = today.charAt(0).toUpperCase() + today.slice(1)

    companonFiltered.value = companonsList.value
        .filter(companion => {
            const isAvailableToday = companion.availabilities.some(
                jour => jour.day === todayCapitalized
            )

            const matchAnimal = selectedTypeAnimal.value.length === 0 ||
            selectedTypeAnimal.value.some(type =>
                normalizeText(companion.name).includes(normalizeText(type))
            )
            const matchGame = selectedGame.value.length === 0 ||
                selectedGame.value.some(game => companion.game.includes(game))

            return isAvailableToday && matchAnimal && matchGame
        })
        .map(companion => ({
            name: companion.name,
            presence: companion.availabilities.find(
                jour => jour.day === todayCapitalized
            )!,
            loveName: companion.loveName,
            loveImage: companion.loveImage,
            region: companion.region,
            image: companion.image,
            job: companion.job.image,
            id: companion.id,
            game: companion.game
        }))
        .sort((a, b) => {
            const aExists = companonUser.value.some(
                user => user.companion.name === a.name
            )

            const bExists = companonUser.value.some(
                user => user.companion.name === b.name
            )

            if (aExists !== bExists) {
                return Number(aExists) - Number(bExists)
            }

            return a.name.localeCompare(b.name, 'fr')
        })
}


const createTask = async () =>{
    if (form.description.trim() !== '') {
        try{
            const task : taskDto = await $fetch<taskDto>('/api/task/create', {
            method: 'POST',
            body: form
            })

            tasks.value.push(task)
            tasks.value.sort((a, b) => Number(a.isCompleted) - Number(b.isCompleted))
            form.description=''
            toast.success('Tâche ajoutée')
        }catch(e:any){
            toast.error(e.data?.message)
        }

    }
}

const updateTask = async (event: taskDto) => {
    try{
        await $fetch<taskDto>(`/api/task/${event.id}`, {
                method: 'PATCH',
                body: {isCompleted: event.isCompleted, checked: form.checked}
        })

        tasks.value.sort((a, b) => Number(a.isCompleted) - Number(b.isCompleted))

    }catch(e:any){
         toast.error(e.data?.message)
    }
}

const deleteTask = async(task: taskDto)=>{
    try{
        await $fetch<taskDto>(`/api/task/${task.id}`, {
                method: 'DELETE',
                body: {checked: form.checked}
        })

        tasks.value = tasks.value.filter((element: taskDto)=> element.id !== task.id)
    }catch(e:any){
         toast.error(e.data?.message)
    }
}

</script>