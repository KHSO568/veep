<template>
    <div class="bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border-2 border-gray-700">
        <div class="bg-gradient-to-r from-indigo-600 to-blue-600 p-6">
            <div class="flex justify-between items-center">
                <div>
                    <h2 class="text-2xl font-bold text-white flex items-center gap-3">
                        <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Événements
                    </h2>
                    <p class="text-indigo-200 text-sm mt-1">
                        {{ filteredEvents.length }} événement(s)
                    </p>
                </div>
                <div class="flex items-center gap-4">
                    <div class="relative">
                        <input v-model="searchQuery" type="text" placeholder="Rechercher un événement..."
                            class="w-64 bg-gray-900 border-2 border-gray-700 text-white p-3 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 outline-none" />
                    </div>
                    <button v-if="selectedEvents.length"
                        class="bg-rose-600 hover:bg-rose-700 text-white px-5 py-3 rounded-xl transition-all font-bold shadow-lg flex items-center gap-2"
                        @click="$emit('delete-multiple', selectedEvents)">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        {{ selectedEvents.length }}
                    </button>
                </div>
            </div>
        </div>
        <div class="p-6">
            <div v-if="filteredEvents.length" class="space-y-4">
                <div v-for="event in filteredEvents" :key="event.id"
                    class="bg-gray-900 border-2 border-gray-700 hover:border-purple-500 rounded-2xl p-5 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20 group">
                    <div class="flex gap-5">
                        <input type="checkbox" v-if="event.userId === user?.uid"
                            class="w-6 h-6 cursor-pointer accent-purple-600 rounded-lg mt-1" v-model="selectedEvents"
                            :value="event.id" />

                        <div v-if="event.image" class="flex-shrink-0 cursor-pointer" @click="$emit('select', event)">
                            <img :src="event.image" alt="événement"
                                class="w-28 h-28 object-cover rounded-xl border-2 border-gray-700 group-hover:border-purple-500 transition-all shadow-lg" />
                        </div>

                        <div class="flex-1 min-w-0 cursor-pointer" @click="$emit('select', event)">
                            <h3
                                class="font-bold text-xl text-white mb-2 truncate group-hover:text-purple-400 transition-colors">
                                {{ event.name }}
                            </h3>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                <div class="flex items-center gap-2 text-gray-300">
                                    <svg class="w-4 h-4 text-purple-400" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span class="text-sm">{{ event.location }}</span>
                                </div>

                                <div class="flex items-center gap-2 text-gray-300">
                                    <svg class="w-4 h-4 text-blue-400" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span class="text-sm">{{ formatDateTime(event.startTime) }}</span>
                                </div>
                            </div>

                            <div class="text-gray-400 text-sm mb-3 line-clamp-2"
                                v-html="event.description || 'Aucune description'">
                            </div>

                            <div
                                class="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-full font-bold shadow-lg">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {{ formatDate(event.startTime) }}
                            </div>
                        </div>

                        <div v-if="event.userId === user?.uid || isAdmin" class="flex flex-col gap-2">
                            <button
                                class="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-4 py-2 rounded-xl transition-all font-semibold shadow-lg flex items-center gap-2"
                                @click.stop="$emit('edit', event)">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Modifier
                            </button>
                            <button
                                class="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white px-4 py-2 rounded-xl transition-all font-semibold shadow-lg flex items-center gap-2"
                                @click.stop="$emit('delete', event)">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Supprimer
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div v-else class="text-center py-20">
                <div
                    class="w-32 h-32 mx-auto mb-6 rounded-full bg-gray-900 flex items-center justify-center border-4 border-gray-700">
                    <svg class="w-16 h-16 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
                <h3 class="text-2xl font-bold text-gray-400 mb-2">
                    Aucun événement
                </h3>
                <p class="text-gray-500">
                    Créez votre premier événement pour commencer
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
    events: {
        type: Array,
        default: () => []
    },
    user: {
        type: Object,
        default: null
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});

defineEmits(['edit', 'delete', 'delete-multiple', 'select']);

const searchQuery = ref('');
const selectedEvents = ref([]);

const filteredEvents = computed(() => {
    let filtered = props.events;
    if (searchQuery.value.trim()) {
        filtered = filtered.filter(
            (e) =>
                e.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                e.location.toLowerCase().includes(searchQuery.value.toLowerCase())
        );
    }
    return filtered;
});

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString("fr-FR", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};
</script>
