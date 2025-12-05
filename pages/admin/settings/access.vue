<template>
  <NuxtLayout name="admin">
    <div>
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 font-Baloo">Droits d'accès</h1>
      </div>

      <div class="mb-6 flex items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <select v-model="treatmentFilter"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-veep-orange">
            <option value="">Traitement</option>
            <option value="pending">En attente</option>
            <option value="processed">Traité</option>
          </select>

          <select v-model="statusFilter"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-veep-orange">
            <option value="">Status</option>
            <option value="active">Actif</option>
            <option value="inactive">Inactif</option>
          </select>

          <div class="relative flex-1 min-w-[300px]">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none"
              stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input v-model="searchQuery" type="text" placeholder="Rechercher un événement..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-veep-orange" />
          </div>
        </div>

        <button @click="showModal = true"
          class="bg-veep-orange text-white px-6 py-2 rounded-lg hover:bg-veep-orange-dark transition-colors font-medium flex items-center gap-2">
          <span>+</span>
          Ajouter un membre
        </button>
      </div>

      <!-- Members Table -->
      <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Nom et Prénoms</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Téléphone</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Rôles</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Code</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Accès</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="member in filteredMembers" :key="member.uid" class="border-b border-gray-100 hover:bg-gray-50">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-semibold">
                    {{ member.Name?.charAt(0)?.toUpperCase() || member.email?.charAt(0)?.toUpperCase() || '?' }}
                  </div>
                  <span class="font-medium text-gray-900">{{ member.Name || member.email }}</span>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-600">{{ member.phone || '-' }}</td>
              <td class="px-6 py-4 text-sm text-gray-600">{{ member.role }}</td>
              <td class="px-6 py-4 text-sm text-gray-600">{{ member.uid?.substring(0, 8) || '-' }}</td>
              <td class="px-6 py-4">
                <span
                  class="inline-flex items-center gap-1 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                  {{ getPermissionsCount(member.permissions) }}
                  <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                      clip-rule="evenodd" />
                  </svg>
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <button @click="editMember(member)" class="text-gray-400 hover:text-veep-orange transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button @click="deleteMember(member.uid)" class="text-gray-400 hover:text-red-500 transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredMembers.length === 0">
              <td colspan="6" class="px-6 py-12 text-center text-gray-400">
                Aucun membre trouvé
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Add/Edit Member Modal -->
      <div v-if="showModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        @click.self="closeModal">
        <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-bold text-gray-900">{{ editingMember ? 'Modifier' : 'Ajouter' }} un membre</h3>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="saveMember" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                <input v-model="formData.lastName" type="text" required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-veep-orange" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                <input v-model="formData.firstName" type="text" required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-veep-orange" />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Numéro de téléphone</label>
                <input v-model="formData.phone" type="tel" required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-veep-orange" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
                <input v-model="formData.role" type="text" required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-veep-orange" />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">Permissions</label>
              <div class="grid grid-cols-2 gap-3">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" v-model="formData.permissions.organisateurs"
                    class="w-5 h-5 rounded border-gray-300 text-green-500 focus:ring-green-500" />
                  <span class="text-sm text-gray-700">Organisateurs</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" v-model="formData.permissions.cartes"
                    class="w-5 h-5 rounded border-gray-300 text-green-500 focus:ring-green-500" />
                  <span class="text-sm text-gray-700">Cartes</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" v-model="formData.permissions.utilisateurs"
                    class="w-5 h-5 rounded border-gray-300 text-green-500 focus:ring-green-500" />
                  <span class="text-sm text-gray-700">Utilisateurs</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" v-model="formData.permissions.reversements"
                    class="w-5 h-5 rounded border-gray-300 text-green-500 focus:ring-green-500" />
                  <span class="text-sm text-gray-700">Reversements</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" v-model="formData.permissions.compensations"
                    class="w-5 h-5 rounded border-gray-300 text-green-500 focus:ring-green-500" />
                  <span class="text-sm text-gray-700">Compensations</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" v-model="formData.permissions.droitsAcces"
                    class="w-5 h-5 rounded border-gray-300 text-green-500 focus:ring-green-500" />
                  <span class="text-sm text-gray-700">Droits d'accès</span>
                </label>
              </div>
            </div>

            <button type="submit"
              class="w-full bg-veep-orange text-white py-3 rounded-lg hover:bg-veep-orange-dark transition-colors font-medium">
              {{ editingMember ? 'Modifier' : 'Ajouter' }} un membre
            </button>
          </form>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { collection, getDocs, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '~/composables/useToast';
import { ERROR_MESSAGES } from '~/utils/errorMessages';

definePageMeta({
  middleware: 'admin',
  layout: false
});

const { $db } = useNuxtApp();
const { user } = useAuth();
const toast = useToast();

const members = ref([]);
const showModal = ref(false);
const editingMember = ref(null);
const treatmentFilter = ref('');
const statusFilter = ref('');
const searchQuery = ref('');

const formData = ref({
  firstName: '',
  lastName: '',
  phone: '',
  role: 'moderator',
  permissions: {
    organisateurs: false,
    cartes: false,
    utilisateurs: false,
    reversements: false,
    compensations: false,
    droitsAcces: false
  }
});

const filteredMembers = computed(() => {
  let filtered = members.value;

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(m =>
      m.Name?.toLowerCase().includes(query) ||
      m.email?.toLowerCase().includes(query)
    );
  }

  return filtered;
});

const getInitials = (firstName, lastName) => {
  if (firstName && lastName) {
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  }
  return firstName?.charAt(0)?.toUpperCase() || '?';
};

const getPermissionsCount = (permissions) => {
  if (!permissions) return 0;
  return Object.values(permissions).filter(p => p === true).length;
};

const saveMember = async () => {
  try {
    if (!editingMember.value) {
      toast.warning('Utilisez la page d\'inscription pour créer de nouveaux comptes');
      return;
    }

    // Update existing user's permissions
    const memberData = {
      permissions: formData.value.permissions,
      updatedAt: serverTimestamp()
    };

    await updateDoc(doc($db, 'users', editingMember.value.uid), memberData);

    const index = members.value.findIndex(m => m.uid === editingMember.value.uid);
    if (index !== -1) {
      members.value[index] = {
        ...members.value[index],
        permissions: formData.value.permissions
      };
    }

    toast.success(ERROR_MESSAGES.ACCESS_UPDATE_SUCCESS);
    closeModal();
  } catch (error) {
    console.error('Error saving member:', error);
    toast.error(ERROR_MESSAGES.ACCESS_UPDATE_ERROR);
  }
};

const editMember = (member) => {
  editingMember.value = member;
  formData.value = {
    firstName: member.Name?.split(' ')[0] || '',
    lastName: member.Name?.split(' ').slice(1).join(' ') || '',
    phone: member.phone || '',
    role: member.role || 'moderator',
    permissions: member.permissions || {
      organisateurs: false,
      cartes: false,
      utilisateurs: false,
      reversements: false,
      compensations: false,
      droitsAcces: false
    }
  };
  showModal.value = true;
};

const deleteMember = async (memberUid) => {
  if (!confirm(ERROR_MESSAGES.DELETE_CONFIRM)) return;

  try {
    await deleteDoc(doc($db, 'users', memberUid));
    members.value = members.value.filter(m => m.uid !== memberUid);
    toast.success(ERROR_MESSAGES.USER_DELETE_SUCCESS);
  } catch (error) {
    console.error('Error deleting member:', error);
    toast.error(ERROR_MESSAGES.USER_DELETE_ERROR);
  }
};

const closeModal = () => {
  showModal.value = false;
  editingMember.value = null;
  formData.value = {
    firstName: '',
    lastName: '',
    phone: '',
    role: 'moderator',
    permissions: {
      organisateurs: false,
      cartes: false,
      utilisateurs: false,
      reversements: false,
      compensations: false,
      droitsAcces: false
    }
  };
};

onMounted(async () => {
  try {
    const snapshot = await getDocs(collection($db, 'users'));
    members.value = snapshot.docs.map(doc => ({
      uid: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error loading members:', error);
    toast.error(ERROR_MESSAGES.LOADING_ERROR);
  }
});
</script>
