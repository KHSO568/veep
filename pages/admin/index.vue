<template>
  <NuxtLayout name="admin">
    <div>
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 font-Baloo">Dashboard</h1>
        <p class="text-sm text-gray-500 mt-1">
          Vue d'ensemble de votre plateforme
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Utilisateurs"
          :value="stats.users"
          icon="users"
          color="blue"
        />
        <StatsCard
          title="Événements"
          :value="stats.events"
          icon="events"
          color="purple"
        />
        <StatsCard
          title="Produits"
          :value="stats.products"
          icon="products"
          color="green"
        />
        <StatsCard
          title="Actions (24h)"
          :value="stats.recentActions"
          icon="actions"
          color="orange"
        />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <QuickActionCard
          to="/admin/users"
          title="Gestion des utilisateurs"
          description="Gérez les comptes et rôles"
          color="veep-orange"
        >
          <template #icon>
            <svg
              class="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </template>
        </QuickActionCard>

        <QuickActionCard
          to="/profile/settings"
          title="Sécurité"
          description="2FA, sessions et mot de passe"
          color="green"
        >
          <template #icon>
            <svg
              class="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </template>
        </QuickActionCard>

        <QuickActionCard
          to="/admin/users/invitations"
          title="Invitations"
          description="Inviter de nouveaux utilisateurs"
          color="blue"
        >
          <template #icon>
            <svg
              class="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </template>
        </QuickActionCard>
      </div>

      <div class="bg-white rounded-lg border border-gray-200">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">
            Activités récentes
          </h2>
        </div>
        <div class="p-6">
          <ActivityLog :logs="recentLogs" :loading="loading" />
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { collection, getDocs, Timestamp } from "firebase/firestore";

definePageMeta({
  middleware: "admin",
  layout: false,
});

const { $db } = useNuxtApp();
const { getRecentLogs } = useAuditLog();

const stats = ref({
  users: 0,
  events: 0,
  products: 0,
  recentActions: 0,
});

const recentLogs = ref([]);
const loading = ref(true);

onMounted(async () => {
  try {
    const [usersSnap, eventsSnap, productsSnap] = await Promise.all([
      getDocs(collection($db, "users")),
      getDocs(collection($db, "events")),
      getDocs(collection($db, "products")),
    ]);

    stats.value.users = usersSnap.size;
    stats.value.events = eventsSnap.size;
    stats.value.products = productsSnap.size;

    const logs = await getRecentLogs(20);
    recentLogs.value = logs;

    const oneDayAgo = Timestamp.fromDate(
      new Date(Date.now() - 24 * 60 * 60 * 1000)
    );
    const recentActions = logs.filter((log) => {
      const logTime = log.timestamp?.toDate?.() || new Date(log.timestamp);
      return logTime > oneDayAgo.toDate();
    });
    stats.value.recentActions = recentActions.length;
  } catch (error) {
    console.error("Error loading dashboard data:", error);
  } finally {
    loading.value = false;
  }
});
</script>
