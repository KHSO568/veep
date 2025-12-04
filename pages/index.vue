<template>
  <div class="min-h-screen bg-gray-900 text-gray-100">
    <Header />

    <div class="max-w-7xl mx-auto px-6 py-8">
      <!-- Toast message -->
      <div v-if="message" :class="[
        'fixed top-8 right-8 px-6 py-4 rounded-2xl shadow-2xl text-white z-50 backdrop-blur-xl border-2',
        messageType === 'success' ? 'bg-emerald-500/90 border-emerald-400' : 'bg-rose-500/90 border-rose-400',
        'animate-toast'
      ]">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <span class="text-xl">{{ messageType === 'success' ? '✓' : '✗' }}</span>
          </div>
          <span class="font-semibold">{{ message }}</span>
        </div>
      </div>

      <div v-if="showConfirm"
        class="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 animate-fadeIn">
        <div
          class="bg-gray-800 p-8 rounded-3xl shadow-2xl max-w-lg w-full mx-4 border-2 border-gray-700 animate-scaleIn">
          <div
            class="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-rose-500 to-orange-600">
            <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          <h3 class="text-2xl font-bold mb-4 text-center text-white">Attention</h3>
          <p class="text-gray-300 mb-8 text-center text-lg leading-relaxed">{{ confirmMessage }}</p>

          <div class="flex gap-4">
            <button @click="cancelAction"
              class="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-6 py-4 rounded-2xl transition-all font-semibold text-lg">Annuler</button>
            <button @click="confirmAction"
              class="flex-1 bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-700 hover:to-orange-700 text-white px-6 py-4 rounded-2xl transition-all font-semibold text-lg shadow-lg">Confirmer</button>
          </div>
        </div>
      </div>

      <div v-if="user">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div class="lg:col-span-1">
            <div class="bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border-2 border-gray-700 sticky top-8">
              <div class="bg-gradient-to-r from-purple-600 to-indigo-600 p-6">
                <h2 class="text-2xl font-bold text-white flex items-center gap-3">
                  <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                  {{ editMode ? 'Modification' : "Nouvel événement" }}
                </h2>
              </div>

              <div class="p-6 space-y-5">
                <div>
                  <label class="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wide">Nom de
                    l'événement</label>
                  <input v-model="form.name" type="text" placeholder="Concert de jazz en plein air"
                    class="w-full bg-gray-900 border-2 border-gray-700 text-white p-4 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all outline-none placeholder-gray-500"
                    required />
                </div>

                <div>
                  <label class="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wide">Lieu</label>
                  <input v-model="form.location" type="text" placeholder="Parc Central, Paris"
                    class="w-full bg-gray-900 border-2 border-gray-700 text-white p-4 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all outline-none placeholder-gray-500"
                    required />
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wide">Heure de
                      début</label>
                    <input v-model="form.startTime" type="datetime-local"
                      class="w-full bg-gray-900 border-2 border-gray-700 text-white p-4 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all outline-none"
                      required />
                  </div>

                  <div>
                    <label class="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wide">Heure de
                      fin</label>
                    <input v-model="form.endTime" type="datetime-local"
                      class="w-full bg-gray-900 border-2 border-gray-700 text-white p-4 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all outline-none"
                      required />
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wide">Description</label>
                  <client-only>
                    <AiEditor v-model="form.description" />
                  </client-only>
                </div>

                <div>
                  <label class="block text-sm font-bold text-gray-300 mb-3 uppercase tracking-wide">Image</label>
                  <button type="button" @click="triggerFileInput"
                    class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-4 px-6 rounded-xl transition-all font-bold flex items-center justify-center gap-3 shadow-lg">
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
                  <button @click="submitEvent" :disabled="!isFormValid"
                    class="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-4 px-6 rounded-xl transition-all font-bold text-lg shadow-lg disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:from-emerald-600 disabled:hover:to-teal-600">
                    {{ editMode ? 'Enregistrer' : "Créer l'événement" }}
                  </button>

                  <button v-if="editMode" @click="cancelEdit"
                    class="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded-xl transition-all font-semibold">Annuler</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Events list column -->
          <div class="lg:col-span-2">
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
                    <p class="text-indigo-200 text-sm mt-1">{{ filteredEvents.length }} événement(s)</p>
                  </div>

                  <div class="flex items-center gap-4">
                    <div class="relative">
                      <input v-model="searchQuery" type="text" placeholder="Rechercher un événement..."
                        class="w-64 bg-gray-900 border-2 border-gray-700 text-white p-3 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 outline-none" />
                    </div>

                    <button v-if="selectedEvents.length"
                      class="bg-rose-600 hover:bg-rose-700 text-white px-5 py-3 rounded-xl transition-all font-bold shadow-lg flex items-center gap-2"
                      @click="confirmMultipleDelete">
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
                      <input type="checkbox" v-if="event.userId === user.uid"
                        class="w-6 h-6 cursor-pointer accent-purple-600 rounded-lg mt-1" v-model="selectedEvents"
                        :value="event.id" />

                      <div v-if="event.image" class="flex-shrink-0 cursor-pointer" @click="selectEvent(event)">
                        <img :src="event.image" alt="événement"
                          class="w-28 h-28 object-cover rounded-xl border-2 border-gray-700 group-hover:border-purple-500 transition-all shadow-lg" />
                      </div>

                      <div class="flex-1 min-w-0 cursor-pointer" @click="selectEvent(event)">
                        <h3
                          class="font-bold text-xl text-white mb-2 truncate group-hover:text-purple-400 transition-colors">
                          {{ event.name }}</h3>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                          <div class="flex items-center gap-2 text-gray-300">
                            <svg class="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span class="text-sm">{{ event.location }}</span>
                          </div>

                          <div class="flex items-center gap-2 text-gray-300">
                            <svg class="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span class="text-sm">{{ formatDateTime(event.startTime) }}</span>
                          </div>
                        </div>

                        <div class="text-gray-400 text-sm mb-3 line-clamp-2"
                          v-html="event.description || 'Aucune description'"></div>

                        <div
                          class="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-full font-bold shadow-lg">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {{ formatDate(event.startTime) }}
                        </div>
                      </div>

                      <div v-if="event.userId === user.uid || isAdmin" class="flex flex-col gap-2">
                        <button @click.stop="startEdit(event)"
                          class="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-4 py-2 rounded-xl transition-all font-semibold shadow-lg flex items-center gap-2">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Modifier
                        </button>

                        <button @click.stop="confirmSingleDelete(event)"
                          class="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white px-4 py-2 rounded-xl transition-all font-semibold shadow-lg flex items-center gap-2">
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

                  <h3 class="text-2xl font-bold text-gray-400 mb-2">Aucun événement</h3>
                  <p class="text-gray-500">Créez votre premier événement pour commencer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- If no user, show nothing (Header handles login) -->
    </div>

    <EventDetails :event="selectedEvent" :formatDate="formatDate" :formatDateTime="formatDateTime"
      @close="selectedEvent = null" />
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ['auth']
})
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile } from 'firebase/auth';
import { getStorage, ref as storageRef, uploadString, getDownloadURL } from 'firebase/storage';

import AiEditor from '~/components/AiEditor.vue';
import EventDetails from '~/components/EventDetails.vue';
import Header from '~/components/Header.vue';

const { $db, $auth, $config } = useNuxtApp();
const storage = (() => {
  try {
    return getStorage();
  } catch (e) {
    return null;
  }
})();

const { user: authUser, isAdmin } = useAuth();
const { logAction } = useAuditLog();

// Reactive state
const user = ref(null);
const message = ref('');
const messageType = ref('success');

const showConfirm = ref(false);
const confirmMessage = ref('');
let confirmCallback = null;

const fileInput = ref(null);
const imagePreview = ref('');
const imageFile = ref(null);

const editMode = ref(false);
const editId = ref(null);

const events = ref([]);
const selectedEvent = ref(null);
const selectedEvents = ref([]);
const searchQuery = ref('');

const form = ref({
  name: '',
  location: '',
  startTime: '',
  endTime: '',
  description: '',
  image: '',
});

// Auth helpers: login/register/logout
const loginEmail = ref('');
const loginPassword = ref('');

const registerName = ref('');
const registerEmail = ref('');
const registerPassword = ref('');

const showMessage = (text, type = 'success') => {
  message.value = text;
  messageType.value = type;
  setTimeout(() => (message.value = ''), 3000);
};

const triggerFileInput = () => {
  if (fileInput.value) fileInput.value.click();
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
  if (fileInput.value) fileInput.value.value = '';
};

// Confirm utilities
const openConfirm = (text, callback) => {
  confirmMessage.value = text;
  confirmCallback = callback;
  showConfirm.value = true;
};

const confirmAction = async () => {
  showConfirm.value = false;
  if (confirmCallback) await confirmCallback();
  confirmCallback = null;
};

const cancelAction = () => {
  showConfirm.value = false;
  confirmCallback = null;
};

// Formatting
const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
};

const formatDateTime = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleString('fr-FR', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

// Validation
const isFormValid = computed(() => {
  return (
    form.value.name.trim() !== '' &&
    form.value.location.trim() !== '' &&
    form.value.startTime !== '' &&
    form.value.endTime !== '' &&
    new Date(form.value.startTime) < new Date(form.value.endTime)
  );
});

// CRUD operations
const submitEvent = async () => {
  if (!user.value) {
    showMessage("Veuillez vous connecter pour créer un'événement", 'error');
    return;
  }

  if (!isFormValid.value) {
    showMessage("Formulaire invalide — vérifiez les dates et les champs requis", 'error');
    return;
  }

  try {
    const eventData = {
      name: form.value.name,
      location: form.value.location,
      startTime: form.value.startTime,
      endTime: form.value.endTime,
      description: form.value.description,
      userId: user.value.uid,
      userEmail: user.value.email,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    // Upload image to Firebase Storage if available and file exists
    if (imageFile.value && storage) {
      const storageReference = storageRef(storage, `events/${user.value.uid}/${Date.now()}-${imageFile.value.name}`);
      // upload as data_url (base64) for simplicity
      await uploadString(storageReference, imagePreview.value, 'data_url');
      const url = await getDownloadURL(storageReference);
      eventData.image = url;
    } else if (imagePreview.value) {
      // fallback: store base64 (not recommended for production)
      eventData.image = imagePreview.value;
    }

    if (editMode.value && editId.value) {
      await updateDoc(doc($db, 'events', editId.value), {
        ...eventData,
        updatedAt: serverTimestamp(),
      });
      await logAction('update_event', 'event', editId.value, { name: form.value.name });
      showMessage("Événement modifié avec succès");
    } else {
      const docRef = await addDoc(collection($db, 'events'), eventData);
      await logAction('create_event', 'event', docRef.id, { name: form.value.name });
      showMessage("Événement ajouté avec succès");
    }

    resetForm();
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error);
    showMessage('Erreur lors de la sauvegarde: ' + (error.message || error), 'error');
  }
};

const resetForm = () => {
  form.value = { name: '', location: '', startTime: '', endTime: '', description: '', image: '' };
  imagePreview.value = '';
  imageFile.value = null;
  if (fileInput.value) fileInput.value.value = '';
  editMode.value = false;
  editId.value = null;
};

const startEdit = (event) => {
  editMode.value = true;
  editId.value = event.id;
  form.value.name = event.name || '';
  form.value.location = event.location || '';
  form.value.startTime = event.startTime || '';
  form.value.endTime = event.endTime || '';
  form.value.description = event.description || '';
  imagePreview.value = event.image || '';
};

const cancelEdit = () => resetForm();

const confirmSingleDelete = (event) => {
  openConfirm(`Supprimer "${event.name}" ?`, async () => {
    try {
      await deleteDoc(doc($db, 'events', event.id));
      await logAction('delete_event', 'event', event.id, { name: event.name });
      showMessage('Événement supprimé', 'success');
    } catch (error) {
      showMessage('Erreur lors de la suppression: ' + (error.message || error), 'error');
    }
  });
};

const confirmMultipleDelete = () => {
  openConfirm(`Supprimer ${selectedEvents.value.length} événement(s) ?`, async () => {
    try {
      const deletions = selectedEvents.value.map(async (id) => {
        await deleteDoc(doc($db, 'events', id));
        await logAction('delete_event', 'event', id, {});
      });

      await Promise.all(deletions);
      selectedEvents.value = [];
      showMessage('Événements supprimés', 'success');
    } catch (error) {
      showMessage('Erreur lors de la suppression: ' + (error.message || error), 'error');
    }
  });
};

const selectEvent = (event) => {
  selectedEvent.value = event;
};

// Computed: filtered events
const filteredEvents = computed(() => {
  let filtered = events.value || [];
  const q = (searchQuery.value || '').trim().toLowerCase();
  if (q) {
    filtered = filtered.filter((e) => {
      const name = (e.name || '').toLowerCase();
      const loc = (e.location || '').toLowerCase();
      return name.includes(q) || loc.includes(q);
    });
  }
  return filtered;
});

// Auth and realtime listeners
let unsubscribeEvents = null;

onMounted(() => {
  onAuthStateChanged($auth, (u) => {
    user.value = u;
  });

  const q = query(collection($db, 'events'), orderBy('createdAt', 'desc'));
  unsubscribeEvents = onSnapshot(
    q,
    (snapshot) => {
      events.value = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    },
    (error) => {
      console.error('Erreur lors de la récupération des événements:', error);
      showMessage('Erreur de chargement des événements', 'error');
    }
  );
});

onUnmounted(() => {
  if (unsubscribeEvents) unsubscribeEvents();
});
</script>

<style scoped>
/* Petite animation utilitaire (ex: toast, modals) */
@keyframes toastMove {
  from {
    transform: translateY(-8px);
    opacity: 0
  }

  to {
    transform: translateY(0);
    opacity: 1
  }
}

.animate-toast {
  animation: toastMove .25s ease-out;
}

@keyframes scaleIn {
  from {
    transform: scale(.98);
    opacity: 0
  }

  to {
    transform: scale(1);
    opacity: 1
  }
}

.animate-scaleIn {
  animation: scaleIn .18s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0
  }

  to {
    opacity: 1
  }
}

.animate-fadeIn {
  animation: fadeIn .18s ease-out;
}
</style>
