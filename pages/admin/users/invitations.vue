<template>
  <NuxtLayout name="admin">
    <div>
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 font-Baloo">
          Organisateurs
        </h1>
      </div>

      <div class="flex gap-8 mb-8 border-b border-gray-200">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'pb-4 text-sm font-medium transition-all relative flex items-center gap-2',
            activeTab === tab.id
              ? 'text-veep-orange border-b-2 border-veep-orange'
              : 'text-gray-500 hover:text-gray-700',
          ]"
        >
          <span v-if="activeTab === tab.id" class="text-veep-orange">
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </span>
          {{ tab.label }}
          <span class="text-gray-500">({{ tab.count }})</span>
        </button>
      </div>

      <div class="mb-6 flex items-center gap-4">
        <div class="relative">
          <select
            v-model="statusFilter"
            class="appearance-none bg-white border border-gray-200 text-gray-700 py-2.5 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-1 focus:ring-veep-orange focus:border-veep-orange text-sm font-medium min-w-[120px]"
          >
            <option value="">Status</option>
            <option value="pending">En attente</option>
            <option value="accepted">Accepté</option>
            <option value="rejected">Rejeté</option>
          </select>
          <div
            class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500"
          >
            <svg
              class="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        <div class="relative flex-1 max-w-md">
          <svg
            class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Rechercher un organisateur"
            class="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-veep-orange focus:border-veep-orange text-sm placeholder-gray-400"
          />
        </div>
      </div>

      <!-- Table -->
      <div class="bg-white rounded-lg overflow-hidden">
        <table class="w-full">
          <thead class="bg-gray-50/50">
            <tr>
              <th
                class="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider"
              >
                NOM DE L'ORGANISATEUR
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider"
              >
                SECTEUR
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider"
              >
                GERANT
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider"
              >
                DATE D'INSCRIPTION
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider"
              >
                STATUS
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="invitation in filteredInvitations"
              :key="invitation.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 rounded-full bg-blue-500 overflow-hidden"
                  >
                    <div
                      v-if="!invitation.avatar"
                      class="w-full h-full flex items-center justify-center text-white font-bold text-sm"
                    >
                      {{
                        getInitials(
                          invitation.organizationName || invitation.email
                        )
                      }}
                    </div>
                    <img
                      v-else
                      :src="invitation.avatar"
                      class="w-full h-full object-cover"
                    />
                  </div>
                  <span class="font-semibold text-gray-900">{{
                    invitation.organizationName || "MTN Bénin"
                  }}</span>
                </div>
              </td>
              <td class="px-6 py-4">
                <span
                  class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-600"
                >
                  {{ invitation.sector || "Arts et divertissements" }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm font-semibold text-gray-900">{{
                  invitation.managerName || "Amoussou Bruno"
                }}</span>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm font-medium text-gray-900">{{
                  formatDate(invitation.createdAt)
                }}</span>
              </td>
              <td class="px-6 py-4">
                <span
                  :class="[
                    'inline-flex items-center px-4 py-1 rounded-full text-xs font-medium',
                    getStatusColor(invitation.status),
                  ]"
                >
                  {{ getStatusLabel(invitation.status) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

definePageMeta({
  middleware: "admin",
  layout: false,
});

const { $db } = useNuxtApp();

const activeTab = ref("inscriptions");
const tabs = [
  { id: "inscriptions", label: "Inscriptions", count: 34 },
  { id: "active", label: "En activités", count: 20 },
  { id: "rejected", label: "Rejetées", count: 10 },
];

const searchQuery = ref("");
const statusFilter = ref("");
const invitations = ref([]);

const filteredInvitations = computed(() => {
  let filtered = invitations.value;

  if (searchQuery.value.trim()) {
    filtered = filtered.filter((inv) =>
      (inv.organizationName || inv.email)
        ?.toLowerCase()
        .includes(searchQuery.value.toLowerCase())
    );
  }

  if (statusFilter.value) {
    filtered = filtered.filter((inv) => inv.status === statusFilter.value);
  }

  return filtered;
});

const getInitials = (name) => {
  return name?.substring(0, 2).toUpperCase() || "??";
};

const getStatusColor = (status) => {
  const colors = {
    pending: "bg-orange-50 text-veep-orange",
    accepted: "bg-green-50 text-green-600",
    rejected: "bg-red-50 text-red-600",
  };
  return colors[status] || "bg-gray-50 text-gray-600";
};

const getStatusLabel = (status) => {
  const labels = {
    pending: "En attente",
    accepted: "Accepté",
    rejected: "Rejeté",
  };
  return labels[status] || status;
};

const formatDate = (timestamp) => {
  if (!timestamp) return "";
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return (
    date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    }) +
    ", " +
    date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    })
  );
};

onMounted(async () => {
  try {
    const q = query(
      collection($db, "invitations"),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    invitations.value = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      organizationName: "MTN Bénin",
      sector: "Arts et divertissements",
      managerName: "Amoussou Bruno",
      status: doc.data().status || "pending",
    }));

    if (invitations.value.length === 0) {
      invitations.value = Array(6)
        .fill(null)
        .map((_, i) => ({
          id: `mock-${i}`,
          email: `user${i}@example.com`,
          organizationName: "MTN Bénin",
          sector: "Arts et divertissements",
          managerName: "Amoussou Bruno",
          createdAt: new Date(),
          status: "pending",
        }));
    }
  } catch (error) {
    console.error("Error loading invitations:", error);
  }
});
</script>
