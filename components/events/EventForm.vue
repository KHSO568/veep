<template>
    <div class="bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border-2 border-gray-700 sticky top-8">
        <div class="bg-gradient-to-r from-purple-600 to-indigo-600 p-6">
            <h2 class="text-2xl font-bold text-white flex items-center gap-3">
                <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                {{ editMode ? "Modification" : "Nouvel événement" }}
            </h2>
        </div>
        <div class="p-6 space-y-5">
            <div>
                <label class="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wide">Nom de
                    l'événement</label>
                <input v-model="formData.name" type="text" placeholder="Concert de jazz en plein air"
                    class="w-full bg-gray-900 border-2 border-gray-700 text-white p-4 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all outline-none placeholder-gray-500"
                    required />
            </div>

            <div>
                <label class="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wide">Lieu</label>
                <input v-model="formData.location" type="text" placeholder="Parc Central, Paris"
                    class="w-full bg-gray-900 border-2 border-gray-700 text-white p-4 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all outline-none placeholder-gray-500"
                    required />
            </div>

            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wide">Heure de
                        début</label>
                    <input v-model="formData.startTime" type="datetime-local"
                        class="w-full bg-gray-900 border-2 border-gray-700 text-white p-4 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all outline-none"
                        required />
                </div>
                <div>
                    <label class="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wide">Heure de
                        fin</label>
                    <input v-model="formData.endTime" type="datetime-local"
                        class="w-full bg-gray-900 border-2 border-gray-700 text-white p-4 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all outline-none"
                        required />
                </div>
            </div>

            <div>
                <label class="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wide">Description</label>
                <client-only>
                    <AiEditor v-model="formData.description" />
                </client-only>
            </div>

            <div>
                <label class="block text-sm font-bold text-gray-300 mb-3 uppercase tracking-wide">Image</label>
                <button type="button"
                    class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-4 px-6 rounded-xl transition-all font-bold flex items-center justify-center gap-3 shadow-lg"
                    @click="() => fileInput.click()">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Choisir une image
                </button>
                <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onImageSelected" />

                <div v-if="imagePreview" class="mt-4 relative group">
                    <img :src="imagePreview" alt="Aperçu"
                        class="w-full h-56 rounded-2xl object-cover border-4 border-gray-700 shadow-lg" />
                    <button type="button" @click="clearImage"
                        class="absolute top-3 right-3 bg-rose-600 hover:bg-rose-700 text-white p-2.5 rounded-full transition-all shadow-lg opacity-0 group-hover:opacity-100">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>

            <div class="pt-4 space-y-3">
                <button @click="handleSubmit" :disabled="!isFormValid"
                    class="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-4 px-6 rounded-xl transition-all font-bold text-lg shadow-lg disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:from-emerald-600 disabled:hover:to-teal-600">
                    {{ editMode ? " Enregistrer" : " Créer l'événement" }}
                </button>
                <button v-if="editMode" @click="$emit('cancel')"
                    class="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded-xl transition-all font-semibold">
                    Annuler
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import AiEditor from "~/components/AiEditor.vue";

const props = defineProps({
    editMode: {
        type: Boolean,
        default: false
    },
    initialData: {
        type: Object,
        default: () => ({})
    }
});

const emit = defineEmits(['submit', 'cancel']);

const formData = ref({
    name: '',
    location: '',
    startTime: '',
    endTime: '',
    description: ''
});

const imagePreview = ref('');
const imageFile = ref(null);
const fileInput = ref(null);

// Initialize form data when initialData changes or component mounts
watch(() => props.initialData, (newData) => {
    if (newData) {
        formData.value = {
            name: newData.name || '',
            location: newData.location || '',
            startTime: newData.startTime || '',
            endTime: newData.endTime || '',
            description: newData.description || ''
        };
        imagePreview.value = newData.image || '';
    } else {
        resetForm();
    }
}, { immediate: true, deep: true });

const resetForm = () => {
    formData.value = {
        name: '',
        location: '',
        startTime: '',
        endTime: '',
        description: ''
    };
    imagePreview.value = '';
    imageFile.value = null;
    if (fileInput.value) fileInput.value.value = '';
};

const onImageSelected = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;

    imageFile.value = f;
    const reader = new FileReader();
    reader.onload = (ev) => (imagePreview.value = ev.target.result);
    reader.readAsDataURL(f);
};

const clearImage = () => {
    imagePreview.value = '';
    imageFile.value = null;
    if (fileInput.value) fileInput.value.value = null;
};

const isFormValid = computed(() =>
    formData.value.name.trim() !== "" &&
    formData.value.location.trim() !== "" &&
    formData.value.startTime !== "" &&
    formData.value.endTime !== ""
);

const handleSubmit = () => {
    emit('submit', {
        ...formData.value,
        image: imagePreview.value,
        imageFile: imageFile.value
    });
};
</script>
