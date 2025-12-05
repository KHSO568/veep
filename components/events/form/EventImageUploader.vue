<template>
    <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Image de l'événement</label>
        <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-veep-orange transition-colors cursor-pointer"
            @click="$refs.fileInput.click()" @dragover.prevent @drop.prevent="handleDrop">
            <div class="space-y-1 text-center">
                <div v-if="imagePreview" class="mb-4">
                    <img :src="imagePreview" class="mx-auto h-32 object-cover rounded-lg" />
                    <p class="text-xs text-gray-500 mt-2">Cliquez pour changer</p>
                </div>
                <div v-else>
                    <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    <div class="flex text-sm text-gray-600 justify-center">
                        <span
                            class="relative cursor-pointer bg-white rounded-md font-medium text-veep-orange hover:text-veep-orange-dark focus-within:outline-none">
                            <span>Téléverser un fichier</span>
                        </span>
                        <p class="pl-1">ou glisser-déposer</p>
                    </div>
                    <p class="text-xs text-gray-500">PNG, JPG, GIF jusqu'à 5MB</p>
                </div>
                <input ref="fileInput" type="file" class="hidden" accept="image/*" @change="handleFileSelect" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
    imagePreview: String
});

const emit = defineEmits(['fileSelected']);

const fileInput = ref(null);

const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) emit('fileSelected', file);
};

const handleDrop = (e) => {
    const file = e.dataTransfer.files[0];
    if (file) emit('fileSelected', file);
};
</script>
