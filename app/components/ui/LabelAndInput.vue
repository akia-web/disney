<template>
    <div class="flex flex-col gap-2 mt-4">
        <div class="flex gap-2 items-center">
            <label :for="id">{{ label }}</label>
                  <p v-if="propertyRules?.$error"
         class=" text-red-700 text-xs font-bold">
        {{ errorMessage }}
      </p>
        </div>
        
        <input v-model="property" 
            :type="type" 
            :id="id" 
            class="border p-2.5 rounded-lg" 
            @blur="propertyRules?.$touch()"
            :placeholder="placeholder"
            :min="min"
            :max="max">
    </div>
</template>
<script lang="ts" setup>
    const props = defineProps({
    property: String,
    min: String,
    max: String,
    type: String,
    label: String,
    id: String,
    placeholder:String,
    propertyRules: Object,
    errorMessage: String
    });

    const emit = defineEmits(['update:property']);

    const property = computed({
      get: () => props.property,
      set: value => emit('update:property', String(value))
    });
</script>