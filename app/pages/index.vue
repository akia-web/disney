<template>
    <div v-if="auth.user" class="flex gap-6 flex-wrap mt-5">
        <div class="bg-white w-full md:w-[40%] p-5 rounded-lg">
            <h1 class="text-center">Liste de tâches</h1>

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

        <div>
            <div class="flex gap-2 mb-2 items-center flex-wrap">

                <select v-model="selectedTypeAnimal" class="bg-white p-1.5 rounded-lg h-[50px]" @change="filtrerCompanion" >
                <option :value="undefined">Aucun filtre</option>
                    <option :value="value" v-for="value in typeAnimals">{{ value }}</option>
                </select>

                <!-- <button v-for="value in typeGame"
                @click="filtrerCompanion(value)"
                class="bg-white p-1 rounded-md h-[50px]">{{ value }}</button> -->
            </div>
            <div class="grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                        <div v-for="companion in animals" class="bg-white rounded-xl p-2 flex flex-col items-center justify-center">
                                <h2 class="text-center">{{ companion.name }}</h2>
                                <img :src="companion.image" class="w-37.5" alt="">
                                <p class="text-center">{{ companion.presence?.hour === undefined? 'Toute la journée': companion.presence.hour }}</p>
                                <p class="text-center">{{ companion.love }}</p>    
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

const typeAnimals = ["Lapin", "Écureuil", "Tortue", "Passereau", "Raton laveur"]
const typeGame = ["Jeu de base", "DLC1", "DLC2", "DLC3", "DLC Winnie", "DLC4"]
const selectedTypeAnimal= ref()

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

const filtrerCompanion = (name?: any) => {
    animals.value=[]
    console.log(selectedTypeAnimal.value)



    const today = new Date().toLocaleDateString(navigator.language, {
            weekday: 'long'
    })  

   const todayCapitalized = today.charAt(0).toUpperCase() + today.slice(1)

    companions.forEach((companion) => {
        const companionDay = companion.presence.find(
            (jour) => jour.day === todayCapitalized
        )

        if (companionDay && (!selectedTypeAnimal.value || companion.name.includes(selectedTypeAnimal.value))) {
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