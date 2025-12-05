<template>
    <div v-if="isOpen" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        @click.self="close">
        <div
            class="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 md:mx-auto p-4 md:p-6 max-h-[90vh] overflow-y-auto">
            <div class="flex items-center justify-between mb-6">
                <h3 class="text-xl font-bold text-gray-900">{{ isEditing ? "Modifier l'événement" : 'Créer un nouvel événement'
                    }}</h3>
                <button @click="close" class="text-gray-400 hover:text-gray-600">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <form @submit.prevent="handleSubmit" class="space-y-4">
                <EventFormFields v-model:title="form.title" v-model:date="form.date" v-model:price="form.price"
                    v-model:location="form.location" />

                <EventImageUploader :imagePreview="imagePreview" @fileSelected="handleFileSelect" />

                <div class="flex gap-3 pt-4">
                    <button type="button" @click="close"
                        class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                        Annuler
                    </button>
                    <button type="submit" :disabled="loading"
                        class="flex-1 px-4 py-2 bg-veep-orange text-white rounded-lg hover:bg-veep-orange-dark transition-colors font-medium flex items-center justify-center gap-2">
                        <span v-if="loading"
                            class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        <span>{{ loading ? (isEditing ? 'Modification...' : 'Création...') : (isEditing ? 'Modifier' :
                            'Créer')
                        }}</span>
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue';
import { collection, addDoc, updateDoc, doc, serverTimestamp, Timestamp } from 'firebase/firestore';
import EventFormFields from './form/EventFormFields.vue';
import EventImageUploader from './form/EventImageUploader.vue';

const props = defineProps({
    isOpen: Boolean,
    organizationId: { type: String, required: true },
    eventToEdit: { type: Object, default: null }
});

const emit = defineEmits(['close', 'created', 'updated']);

const { $db } = useNuxtApp();
const { user } = useAuth();

const form = reactive({
    title: '',
    date: '',
    price: '',
    location: ''
});

const loading = ref(false);
const imageFile = ref(null);
const imagePreview = ref('');
const isEditing = computed(() => !!props.eventToEdit);

watch(() => props.isOpen, (newVal) => {
    if (newVal && props.eventToEdit) {
        form.title = props.eventToEdit.title;
        form.date = formatDateForInput(props.eventToEdit.date);
        form.price = props.eventToEdit.price;
        form.location = props.eventToEdit.location || '';
        imagePreview.value = props.eventToEdit.imageUrl || '';
    } else if (newVal) {
        resetForm();
    }
});

const formatDateForInput = (firestoreDate) => {
    if (!firestoreDate) return '';
    const date = firestoreDate.toDate ? firestoreDate.toDate() : new Date(firestoreDate);
    return date.toISOString().split('T')[0];
};

const handleFileSelect = (file) => {
    imageFile.value = file;
    const reader = new FileReader();
    reader.onload = (e) => (imagePreview.value = e.target.result);
    reader.readAsDataURL(file);
};

const handleSubmit = async () => {
    loading.value = true;
    try {
        let imageUrl = imagePreview.value;

        if (imageFile.value) {
            const reader = new FileReader();
            imageUrl = await new Promise((resolve) => {
                reader.onload = (e) => resolve(e.target.result);
                reader.readAsDataURL(imageFile.value);
            });
        }

        const eventData = {
            title: form.title,
            date: Timestamp.fromDate(new Date(form.date)),
            price: parseFloat(form.price),
            location: form.location,
            imageUrl,
            organizationId: props.organizationId,
            updatedAt: serverTimestamp()
        };

        if (isEditing.value) {
            await updateDoc(doc($db, 'events', props.eventToEdit.id), eventData);
            emit('updated');
        } else {
            eventData.createdAt = serverTimestamp();
            eventData.createdBy = user.value?.uid;
            eventData.creatorEmail = user.value?.email;
            await addDoc(collection($db, 'events'), eventData);
            emit('created');
        }

        close();
    } catch (error) {
        console.error('Error:', error);
    } finally {
        loading.value = false;
    }
};

const resetForm = () => {
    form.title = '';
    form.date = '';
    form.price = '';
    form.location = '';
    imageFile.value = null;
    imagePreview.value = '';
};

const close = () => {
    resetForm();
    emit('close');
};
</script>
