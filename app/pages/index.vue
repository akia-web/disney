<template>
    <div v-if="auth.user" class="flex gap-6 flex-wrap mt-5">
        <div class="bg-white w-full md:w-[40%] p-5 rounded-lg">
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
            <div class="flex gap-2 mb-6 items-center flex-wrap justify-center">

                <UiMultiSelectOption
                    v-model="selectedTypeAnimal"
                    id="companions"
                    placeholder="Tous les compagnons"
                    :table="typeAnimals"
                    @change="filtrerCompanion"
                />
                
                <UiMultiSelectOption
                    v-model="selectedGame"
                    placeholder="Tous les jeux"
                    id="game"
                    :table="typeGame"
                    @change="filtrerByGame"
                />

            </div>
            <div class="grid grid-cols-[repeat(auto-fill,160px)] gap-4 justify-center">
                        <div v-for="companion in animals" class="bg-white rounded-xl p-2 flex flex-col items-center justify-center">
                                <h2 class="text-center text-xs mb-1">{{ companion.name }}</h2>
                                <img :src="companion.image" class="w-[100px] h-[100px] object-contain" alt="">
                                <p class="text-center text-xs font-semibold mt-2">{{ companion.presence?.hour === undefined? 'Toute la journée': companion.presence.hour }}</p>
                                <p class="text-center text-xs">{{ companion.place }}</p>
                                <p class="text-center text-xs italic">{{ companion.love }}</p>    
                        </div>
            </div>
        </div>
       
        
    </div>

</template>
<script lang="ts" setup>
import { companions } from '~/conf/companion';
import type { taskDto } from '~/interfaces/task.dto';

interface CompanionDto{
    name: string;
    presence: {day: string, hour?: string};
    love: string;
    place: string;
    image: string

}

const typeAnimals = ["Lapin", "Écureuil", "Tortue", "Passereau", "Raton laveur", "Renard", "Corbeau", "Crocodile", "Singe", "Cobra", "Capybara", "Hibou", "Bébé dragon", "Pégase", "Oie", "Mouffette", "Abeille", "Hérission"  ]
const typeGame = ["Jeu de base", "DLC 1", "DLC 2", "DLC 3", "DLC Winnie", "DLC 4"]
const selectedTypeAnimal= ref<string[]>([])
const selectedGame=ref<string[]>([])

const auth = useAuthStore()
const tasks = ref<taskDto[]>([])
const toast = useToast()

const animals = ref<CompanionDto[]>([])

const form = reactive({
  description: '',
  checked: false
});

    
onMounted(async ():Promise<void> =>{
    if(auth.user){
         tasks.value = await $fetch<taskDto[]>('/api/task/all')
    }else{
        navigateTo('connexion')
    }

   filtrerCompanion()
   
})

const filtrerCompanion = () => {
    animals.value = []
    selectedGame.value=[]

    const today = new Date().toLocaleDateString(navigator.language, {
        weekday: 'long'
    })

    const todayCapitalized = today.charAt(0).toUpperCase() + today.slice(1)

    companions.forEach((companion) => {
        const companionDay = companion.presence.find(
            (jour) => jour.day === todayCapitalized
        )

        if (
            companionDay &&
            (
                selectedTypeAnimal.value.length === 0 ||
                selectedTypeAnimal.value.some(type => companion.name.includes(type))
            )
        ) {
            animals.value.push({
                name: companion.name,
                presence: companionDay,
                love: companion.love,
                place: companion.place,
                image: companion.image
            })
        }
    })
}


const filtrerByGame = () => {
    animals.value = []
    selectedTypeAnimal.value=[]

    const today = new Date().toLocaleDateString(navigator.language, {
        weekday: 'long'
    })

    const todayCapitalized = today.charAt(0).toUpperCase() + today.slice(1)

    companions.forEach((companion) => {
        const companionDay = companion.presence.find(
            (jour) => jour.day === todayCapitalized
        )

        if (
            companionDay &&
            (
                selectedGame.value.length === 0 ||
                selectedGame.value.some(type => companion.type.includes(type))
            )
        ) {
            animals.value.push({
                name: companion.name,
                presence: companionDay,
                love: companion.love,
                place: companion.place,
                image: companion.image
            })
        }
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