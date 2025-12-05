<template>
    <NuxtLayout name="organization">
        <template #header>Évènements</template>

        <div class="flex flex-col lg:flex-row items-start lg:items-center gap-4 mb-8">
            <div class="flex items-center gap-4 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0">
                <div class="flex items-center bg-white border border-gray-200 rounded-lg p-1 shrink-0">
                    <button class="p-2 text-veep-orange bg-orange-50 rounded">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                    </button>
                    <button class="p-2 text-gray-400 hover:text-gray-600">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>

                <select
                    class="bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-veep-orange shrink-0">
                    <option>Status</option>
                </select>

                <select
                    class="bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-veep-orange shrink-0">
                    <option>Période d'évènement</option>
                </select>
            </div>

            <div class="flex flex-col sm:flex-row gap-4 w-full lg:flex-1">
                <div class="relative flex-1 w-full">
                    <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none"
                        stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input type="text" placeholder="Rechercher un évènement"
                        class="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-veep-orange">
                </div>

                <button @click="showCreateModal = true"
                    class="w-full sm:w-auto bg-veep-orange text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-veep-orange-dark transition-colors flex items-center justify-center gap-2 shrink-0">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Créer un évènement
                </button>
            </div>
        </div>

        <div v-if="loading" class="flex justify-center py-12">
            <div class="w-8 h-8 border-4 border-veep-orange border-t-transparent rounded-full animate-spin"></div>
        </div>

        <div v-else-if="events.length === 0" class="text-center py-12 bg-white rounded-xl border border-gray-200">
            <div
                class="w-16 h-16 bg-orange-50 text-veep-orange rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-1">Aucun événement</h3>
            <p class="text-gray-500 mb-6">Commencez par créer votre premier événement.</p>
            <button @click="showCreateModal = true"
                class="bg-veep-orange text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-veep-orange-dark transition-colors">
                Créer un événement
            </button>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div v-for="event in events" :key="event.id"
                class="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 group hover:shadow-md transition-shadow">
                <!-- Image -->
                <div class="relative h-48 bg-gray-200">
                    <img :src="event.image" class="w-full h-full object-cover" />
                    <div
                        class="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-center min-w-[60px]">
                        <div class="text-xl font-bold text-gray-900">{{ getDay(event.date) }}</div>
                        <div class="text-xs font-medium text-gray-600 uppercase">{{ getMonth(event.date) }}</div>
                    </div>
                    <div class="absolute bottom-4 left-4">
                        <span
                            class="bg-gray-900/60 backdrop-blur text-white text-xs font-medium px-3 py-1 rounded-full uppercase tracking-wide">
                            {{ event.status === 'draft' ? 'Brouillon' : event.status }}
                        </span>
                    </div>
                </div>

                <!-- Content -->
                <div class="p-4">
                    <h3 class="font-bold text-lg text-gray-900 mb-4 truncate" :title="event.title">{{ event.title }}
                    </h3>

                    <div class="space-y-3">
                        <div class="flex items-center justify-between text-sm">
                            <div class="flex items-center gap-2">
                                <span
                                    class="w-6 h-6 rounded bg-purple-100 text-purple-600 flex items-center justify-center">
                                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                                    </svg>
                                </span>
                                <span class="font-bold text-gray-900">{{ event.ticketsSold }}</span>
                            </div>
                            <span class="text-gray-500">tickets vendus</span>
                        </div>

                        <div class="flex items-center justify-between text-sm">
                            <div class="flex items-center gap-2">
                                <span class="font-bold text-veep-orange text-lg">{{ formatCurrency(event.price) }}
                                    <span class="text-xs align-top">FCFA</span></span>
                            </div>
                            <span class="text-gray-500">Prix du ticket</span>
                        </div>
                    </div>

                    <!-- Actions (RBAC) -->
                    <div v-if="canManageEvent(event)" class="mt-4 pt-4 border-t border-gray-100 flex gap-2">
                        <button @click.stop="openEditModal(event)"
                            class="flex-1 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-center gap-1">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Modifier
                        </button>
                        <button @click.stop="deleteEvent(event)"
                            class="flex-1 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors flex items-center justify-center gap-1">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Supprimer
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <CreateEventModal :is-open="showCreateModal" :organization-id="route.params.id" :event-to-edit="selectedEvent"
            @close="closeModal" @created="fetchEvents" @updated="fetchEvents" />
    </NuxtLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { collection, query, where, getDocs, orderBy, deleteDoc, doc } from 'firebase/firestore';
import CreateEventModal from '~/components/events/CreateEventModal.vue';

definePageMeta({
    layout: false
});

const route = useRoute();
const { $db } = useNuxtApp();
const { user } = useAuth();
const toast = useToast();

const events = ref([]);
const loading = ref(true);
const showCreateModal = ref(false);
const selectedEvent = ref(null);

const fetchEvents = async () => {
    loading.value = true;
    try {
        const q = query(collection($db, 'events'), orderBy('createdAt', 'desc'));

        const snapshot = await getDocs(q);
        events.value = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error fetching events:', error);
    } finally {
        loading.value = false;
    }
};

const canManageEvent = (event) => {
    if (!user.value) return false;
    if (user.value.role === 'admin') return true;
    if (user.value.role === 'moderator' && event.createdBy === user.value.uid) return true;
    return false;
};

const openEditModal = (event) => {
    selectedEvent.value = event;
    showCreateModal.value = true;
};

const closeModal = () => {
    showCreateModal.value = false;
    selectedEvent.value = null;
};

const deleteEvent = async (event) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) return;

    try {
        await deleteDoc(doc($db, 'events', event.id));
        toast.success('Événement supprimé');
        fetchEvents();
    } catch (error) {
        console.error('Error deleting event:', error);
        toast.error('Erreur lors de la suppression');
    }
};

const getDateObject = (timestamp) => {
    if (!timestamp) return null;
    // Handle Firebase Timestamp
    if (timestamp.toDate && typeof timestamp.toDate === 'function') {
        return timestamp.toDate();
    }
    // Handle seconds/nanoseconds object
    if (timestamp.seconds) {
        return new Date(timestamp.seconds * 1000);
    }
    // Handle string or Date object
    return new Date(timestamp);
};

const getDay = (timestamp) => {
    const date = getDateObject(timestamp);
    return date ? date.getDate() : '';
};

const getMonth = (timestamp) => {
    const date = getDateObject(timestamp);
    return date ? date.toLocaleString('fr-FR', { month: 'short' }) : '';
};

const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return '0';
    return new Intl.NumberFormat('fr-FR').format(amount);
};

onMounted(() => {
    fetchEvents();
});
</script>
