<template>
  <NuxtLayout name="admin">
    <div>
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 font-Baloo">Utilisateurs</h1>
        <p class="text-sm text-gray-500 mt-1">{{ users.length }} utilisateur(s) au total</p>
      </div>

      <div class="mb-6 flex items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <select v-model="roleFilter"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-veep-orange focus:border-transparent">
            <option value="">Status</option>
            <option value="admin">Admin</option>
            <option value="moderator">Moderator</option>
            <option value="user">User</option>
          </select>
          <div class="relative flex-1 min-w-[300px]">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none"
              stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input v-model="searchQuery" type="text" placeholder="Rechercher un organisateur..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-veep-orange focus:border-transparent" />
          </div>

        </div>

      </div>

      <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div v-if="loading" class="p-12 text-center">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-veep-orange"></div>
          <p class="text-gray-400 mt-4">Chargement...</p>
        </div>

        <div v-else-if="filteredUsers.length === 0" class="p-12 text-center">
          <p class="text-gray-400">Aucun utilisateur trouvé</p>
        </div>
        <div v-else class="p-5 bg-white">
          <div class="flex gap-5 border-b-2 border-gray-200 mb-5">
            <button class="px-4 py-3 text-sm text-orange-500 font-medium relative border-b-2 border-orange-500 -mb-0.5">
              Inscriptions ({{ users.length }})
            </button>
            <button class="px-4 py-3 text-sm text-gray-600">
              En activités ({{users.filter(u => !u.isLocked).length}})
            </button>
            <button class="px-4 py-3 text-sm text-gray-600">
              Bloqués ({{users.filter(u => u.isLocked).length}})
            </button>
          </div>

          <div class="flex gap-3 mb-5">
            <select class="px-3 py-2 border border-gray-300 rounded text-sm cursor-pointer">
              <option>Status</option>
            </select>
            <input type="text" placeholder="Rechercher un organisateur"
              class="flex-1 max-w-xs px-3 py-2 border border-gray-300 rounded text-sm placeholder-gray-400" />
          </div>

          <div class="border border-gray-200 rounded-lg overflow-hidden">
            <table class="w-full border-collapse">
              <thead class="bg-[#F8F8F8]">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    NOM DE L'ORGANISATEUR
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    SECTEUR
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    GÉRANT
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    DATE D'INSCRIPTION
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    STATUS
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in filteredUsers" :key="item.uid"
                  class="border-t border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                  @click="openRoleModal(item)">
                  <td class="px-4 py-4">
                    <div class="flex items-center gap-3">
                      <div
                        class="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                        :class="getAvatarColor(item.Name || item.email)">
                        {{ getInitials(item.Name || item.email) }}
                      </div>
                      <span class="text-sm font-medium text-gray-900">{{ item.Name || item.email }}</span>
                    </div>
                  </td>
                  <td class="px-4 py-4">
                    <span class="inline-block px-3 py-1 rounded-xl text-xs font-medium bg-purple-50 text-purple-600">
                      Général
                    </span>
                  </td>
                  <td class="px-4 py-4 text-sm text-gray-500">{{ item.email }}</td>
                  <td class="px-4 py-4 text-sm text-gray-500">{{ formatDate(item.createdAt) }}</td>
                  <td class="px-4 py-4">
                    <span class="inline-block px-3 py-1 rounded-xl text-xs font-medium"
                      :class="item.isLocked ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'">
                      {{ item.isLocked ? 'Bloqué' : 'Actif' }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div v-if="roleModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        @click.self="roleModal = false">
        <div class="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-bold text-gray-900">Modifier le rôle</h3>
            <button @click="roleModal = false" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="space-y-4">
            <p class="text-gray-700">
              Utilisateur: <span class="font-semibold">{{ selectedUser?.email }}</span>
            </p>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Nouveau rôle</label>
              <select v-model="newRole"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-veep-orange focus:border-transparent">
                <option value="admin">Admin</option>
                <option value="moderator">Moderator</option>
                <option value="user">User</option>
              </select>
            </div>

            <div class="flex gap-3 pt-4">
              <button @click="roleModal = false"
                class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                Annuler
              </button>
              <button @click="updateRole"
                class="flex-1 px-4 py-2 bg-veep-orange text-white rounded-lg hover:bg-veep-orange-dark transition-colors font-medium">
                Confirmer
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="message" :class="[
        'fixed bottom-8 right-8 px-6 py-4 rounded-lg shadow-lg text-white z-50',
        messageType === 'success' ? 'bg-green-500' : 'bg-red-500',
        'animate-toast'
      ]">
        {{ message }}
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  Timestamp
} from "firebase/firestore";

definePageMeta({
  middleware: "admin",
  layout: false
});

const { $db } = useNuxtApp();
const { user } = useAuth();
const { logAction } = useAuditLog();

const users = ref([]);
const loading = ref(true);
const searchQuery = ref("");
const roleFilter = ref("");

const roleModal = ref(false);
const selectedUser = ref(null);
const newRole = ref("");

const message = ref("");
const messageType = ref("success");

// Helper functions for UI
const avatarColors = [
  'bg-pink-600', 'bg-purple-600', 'bg-indigo-600', 'bg-blue-600',
  'bg-green-600', 'bg-yellow-600', 'bg-red-600', 'bg-orange-600'
];

const getAvatarColor = (name) => {
  if (!name) return 'bg-gray-400';
  const index = name.charCodeAt(0) % avatarColors.length;
  return avatarColors[index];
};

const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
};




const filteredUsers = computed(() => {
  let filtered = users.value;

  if (searchQuery.value.trim()) {
    filtered = filtered.filter(
      (u) =>
        u.email?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        u.Name?.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }

  if (roleFilter.value) {
    filtered = filtered.filter((u) => u.role === roleFilter.value);
  }

  return filtered;
});

const formatDate = (timestamp) => {
  if (!timestamp) return "Jamais";
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
};

const showMessage = (text, type = "success") => {
  message.value = text;
  messageType.value = type;
  setTimeout(() => (message.value = ""), 3000);
};

const openRoleModal = (usr) => {
  selectedUser.value = usr;
  newRole.value = usr.role;
  roleModal.value = true;
};

const updateRole = async () => {
  if (!selectedUser.value) return;

  try {
    await updateDoc(doc($db, "users", selectedUser.value.uid), {
      role: newRole.value
    });

    await logAction("update_user_role", "user", selectedUser.value.uid, {
      oldRole: selectedUser.value.role,
      newRole: newRole.value,
      targetEmail: selectedUser.value.email
    });

    // Update local state
    const userIndex = users.value.findIndex(u => u.uid === selectedUser.value.uid);
    if (userIndex !== -1) {
      users.value[userIndex].role = newRole.value;
    }

    roleModal.value = false;
    showMessage("Rôle mis à jour avec succès");
  } catch (error) {
    console.error("Error updating role:", error);
    showMessage("Erreur lors de la mise à jour", "error");
  }
};

const toggleLock = async (usr) => {
  try {
    const newLockState = !usr.isLocked;
    const updateData = {
      isLocked: newLockState
    };

    if (newLockState) {
      updateData.lockedUntil = Timestamp.fromDate(
        new Date(Date.now() + 24 * 60 * 60 * 1000)
      );
    } else {
      updateData.lockedUntil = null;
    }

    await updateDoc(doc($db, "users", usr.uid), updateData);

    await logAction(
      newLockState ? "lock_user" : "unlock_user",
      "user",
      usr.uid,
      {
        targetEmail: usr.email
      }
    );

    usr.isLocked = newLockState;
    usr.lockedUntil = updateData.lockedUntil;
    showMessage(
      newLockState ? "Utilisateur verrouillé" : "Utilisateur déverrouillé"
    );
  } catch (error) {
    console.error("Error toggling lock:", error);
    showMessage("Erreur lors du verrouillage", "error");
  }
};

const exportUsers = () => {
  const csvData = users.value.map((u) => ({
    Email: u.email,
    Nom: u.Name || "",
    Rôle: u.role,
    Statut: u.isLocked ? "Verrouillé" : "Actif",
    "Dernière connexion": formatDate(u.lastLogin)
  }));

  const headers = Object.keys(csvData[0]).join(",");
  const rows = csvData.map((row) => Object.values(row).join(",")).join("\n");
  const csv = `${headers}\n${rows}`;

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `users-export-${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);

  showMessage("Export réussi");
};

onMounted(async () => {
  try {
    const snapshot = await getDocs(collection($db, "users"));
    users.value = snapshot.docs.map((doc) => ({
      ...doc.data(),
      uid: doc.id
    }));
  } catch (error) {
    console.error("Error loading users:", error);
    showMessage("Erreur de chargement", "error");
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
@keyframes toast {
  from {
    transform: translateY(100%);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-toast {
  animation: toast 0.3s ease-out;
}
</style>
