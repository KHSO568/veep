<template>
    <div v-if="isOpen" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        @click.self="close">
        <div class="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6">
            <div class="flex items-center justify-between mb-6">
                <h3 class="text-xl font-bold text-gray-900">{{ isEditing ? 'Modifier l\'événement' : 'Créer un nouvel événement' }}</h3>
                <button @click="close" class="text-gray-400 hover:text-gray-600">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <form @submit.prevent="handleSubmit" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Titre de l'événement</label>
                    <input v-model="form.title" type="text" required
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-veep-orange focus:border-transparent"
                        placeholder="Ex: Concert de fin d'année" />
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Date</label>
                        <input v-model="form.date" type="date" required
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-veep-orange focus:border-transparent" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Prix du ticket (FCFA)</label>
                        <input v-model="form.price" type="number" min="0" required
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-veep-orange focus:border-transparent"
                            placeholder="Ex: 5000" />
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Lieu</label>
                    <input v-model="form.location" type="text" required
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-veep-orange focus:border-transparent"
                        placeholder="Ex: Palais des Congrès, Cotonou" />
                </div>

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
                                <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none"
                                    viewBox="0 0 48 48">
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
                            <input ref="fileInput" type="file" class="hidden" accept="image/*"
                                @change="handleFileSelect" />
                        </div>
                    </div>
                </div>

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
                            'Créer') }}</span>
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue';
import { collection, addDoc, updateDoc, doc, serverTimestamp, Timestamp } from 'firebase/firestore';

const props = defineProps({
    isOpen: Boolean,
    organizationId: {
        type: String,
        required: true
    },
    eventToEdit: {
        type: Object,
        default: null
    }
});

const emit = defineEmits(['close', 'created', 'updated']);
const { $db } = useNuxtApp();
const { user } = useAuth();
const toast = useToast();

const loading = ref(false);
const fileInput = ref(null);
const imageFile = ref(null);
const imagePreview = ref(null);

const form = reactive({
    title: '',
    date: '',
    price: '',
    location: ''
});

const isEditing = computed(() => !!props.eventToEdit);

watch(() => props.isOpen, (newVal) => {
    if (newVal && props.eventToEdit) {
        // Populate form for editing
        form.title = props.eventToEdit.title;

        // Handle date format
        let dateVal = props.eventToEdit.date;
        if (dateVal && dateVal.toDate) {
            dateVal = dateVal.toDate();
        } else if (dateVal && dateVal.seconds) {
            dateVal = new Date(dateVal.seconds * 1000);
        } else {
            dateVal = new Date(dateVal);
        }

        form.date = dateVal.toISOString().split('T')[0];
        form.price = props.eventToEdit.price;
        form.location = props.eventToEdit.location;
        imagePreview.value = props.eventToEdit.image;
    } else if (newVal && !props.eventToEdit) {
        resetForm();
    }
});

const close = () => {
    emit('close');
    resetForm();
};

const resetForm = () => {
    form.title = '';
    form.date = '';
    form.price = '';
    form.location = '';
    imageFile.value = null;
    imagePreview.value = null;
    if (fileInput.value) fileInput.value.value = '';
};

const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) processFile(file);
};

const handleDrop = (event) => {
    const file = event.dataTransfer.files[0];
    if (file) processFile(file);
};

const processFile = (file) => {
    if (!file.type.startsWith('image/')) {
        toast.error('Veuillez sélectionner une image valide');
        return;
    }
    if (file.size > 5 * 1024 * 1024) {
        toast.error('L\'image ne doit pas dépasser 5MB');
        return;
    }

    imageFile.value = file;
    const reader = new FileReader();
    reader.onload = (e) => {
        imagePreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
};

const handleSubmit = async () => {
    if (!form.title || !form.date || !form.price || !form.location) {
        toast.error('Veuillez remplir tous les champs obligatoires');
        return;
    }

    loading.value = true;
    try {
        let imageUrl = props.eventToEdit?.image || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30';

        // Convert new image to Base64 if selected
        if (imageFile.value) {
            try {
                imageUrl = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(imageFile.value);
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = error => reject(error);
                });
            } catch (conversionError) {
                console.error('Error converting image:', conversionError);
                toast.error('Erreur lors du traitement de l\'image');
                loading.value = false;
                return;
            }
        }

        const eventDate = new Date(form.date);

        const eventData = {
            title: form.title,
            date: Timestamp.fromDate(eventDate),
            price: Number(form.price),
            location: form.location,
            image: imageUrl,
            organizationId: props.organizationId,
        };

        if (isEditing.value) {
            await updateDoc(doc($db, 'events', props.eventToEdit.id), {
                ...eventData,
                updatedAt: serverTimestamp()
            });
            toast.success('Événement modifié avec succès');
            emit('updated');
        } else {
            await addDoc(collection($db, 'events'), {
                ...eventData,
                status: 'draft',
                ticketsSold: 0,
                revenue: 0,
                createdBy: user.value.uid,
                creatorEmail: user.value.email,
                createdAt: serverTimestamp()
            });
            toast.success('Événement créé avec succès');
            emit('created');
        }

        close();
    } catch (error) {
        console.error('Error saving event:', error);
        toast.error('Erreur lors de l\'enregistrement: ' + error.message);
    } finally {
        loading.value = false;
    }
};
</script>
