<template>
<div v-if="dreamnap && dreamsnaps.length > 0"
    class="fixed inset-0 flex w-full bg-gray-500/80 z-60"
>
    <div class="w-full flex justify-center relative">
             <div class="absolute right-2 top-2 cursor-pointer rounded-full bg-white  text-card-color transition-colors duration-300 ease-in-out hover:bg-light-grey p-1">
                <ClientOnly>
                <Icon name="ant-design:close-outlined" 
                        size="16"
                        @click="close"/>
                </ClientOnly>   
            </div>

        <div class="w-full h-full flex items-center justify-center">
            <div class="relative w-fit h-fit max-w-[90%] max-h-full">

                <img
                    :src="currentDreamnap?.image"
                    class="block max-w-full max-h-[100vh] object-contain"
                    alt=""
                >

                <div class="absolute top-3 left-3 p-1 rounded-sm bg-light-grey/60">
                    <p class="text-sm">{{ currentDreamnap?.theme }}</p>

                    <div class="flex gap-1 items-center">
                        <img
                            src="~/assets/Pierre_de_lune.webp"
                            class="w-[15px] inline-block"
                            alt=""
                        >
                        <p class="text-xs">
                            {{ currentDreamnap?.moonlight }}
                        </p>
                    </div>
                </div>

            </div>
        </div>

        <!-- Bouton suivant -->
        <div
            class="absolute right-1 top-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-white border border-card-color text-card-color hover:bg-light-grey transition-colors duration-300 ease-in-out"
        >
            <ClientOnly>
                <Icon
                    name="grommet-icons:form-next"
                    size="24"
                    @click="nextOrPrevious('next')"
                />
            </ClientOnly>
        </div>

        <div
            class="absolute left-1 top-1/2 -translate-y-1/2 cursor-pointer border rounded-full bg-white border-card-color hover:bg-light-grey text-card-color transition-colors duration-300 ease-in-out"
        >
            <ClientOnly>
                <Icon
                    name="grommet-icons:form-previous"
                    size="24"
                    @click="nextOrPrevious('previous')"
                />
            </ClientOnly>
        </div>

    </div>
</div>
           
</template>
<script lang="ts" setup>
import type { DreamsnapDto } from '~/interfaces/dreamsnap.dto';
import { ref } from 'vue'


const props = defineProps({
    dreamsnaps: {
        type: Array as PropType<DreamsnapDto[]>,
        required: true
    },
    dreamnap: {
        type: Object as PropType<DreamsnapDto>,
    }
});

const currentDreamnap = ref(props.dreamnap);

const emit = defineEmits(['closeModal']);

const close = () => {
  emit('closeModal')
};

const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
        close();
    }

    if (event.key === 'ArrowLeft') {
       nextOrPrevious('previous')
    }

    if (event.key === 'ArrowRight') {
        nextOrPrevious('next')
    }
};

const nextOrPrevious = (type: 'next' | 'previous') =>{

    const currentIndex = props.dreamsnaps.findIndex(
        d => d.id === currentDreamnap.value?.id
    );

    if (currentIndex === -1) return;

    let newIndex = currentIndex;

    if (type === 'next') {
        newIndex = (currentIndex + 1) % props.dreamsnaps.length;
    } else {
        newIndex = (currentIndex - 1 + props.dreamsnaps.length) % props.dreamsnaps.length;
    }

    currentDreamnap.value  = props.dreamsnaps[newIndex];
};

onMounted(() => {
    window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown);
});



</script>