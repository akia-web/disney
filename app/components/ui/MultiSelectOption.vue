<template>
<div class="relative w-[48%]" ref="dropdownRef">
    <button
        @click="showTypeDropdown = !showTypeDropdown"
        class="bg-white p-1.5 rounded-lg h-[50px] w-full flex justify-between items-center"
        :class="{'rounded-br-none rounded-bl-none': showTypeDropdown}"
    >
        {{ selectedTypeAnimal.length ? `${selectedTypeAnimal.length} sélectionné(s)` : placeholder }}
        <ClientOnly>
            <Icon name="akar-icons:chevron-down-small" />
        </ClientOnly>   
    </button>

    <div
        v-if="showTypeDropdown"
        class="absolute top-full left-0 w-full bg-white rounded-br-lg rounded-bl-lg border-t shadow-lg p-3 z-50 max-h-[250px] overflow-y-auto"
    >
        <label
            v-for="value in table"
            :key="value"
            class="flex items-center gap-2 p-2 cursor-pointer"
        >
            <input
                type="checkbox"
                :value="value"
                v-model="selectedTypeAnimal"
                @change="filtrerCompanion"
            >
            {{ value }}
        </label>
    </div>
</div>



</template>
<script lang="ts" setup>

    const props = defineProps({
    table: Array as PropType<string[]>,
    placeholder: String,
    id: String
    });

    const selectedTypeAnimal = defineModel<string[]>({ default: () => [] })


    const showTypeDropdown = ref(false)

    const emit = defineEmits(['change'])

    const filtrerCompanion = () => {
        emit('change')
    }


const dropdownRef = ref<HTMLElement | null>(null)

const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as Node


    if (!dropdownRef.value?.contains(target)) {
        showTypeDropdown.value = false
    }
}

onMounted(() => {
    document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
})
</script>