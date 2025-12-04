<template>
  <div>
    <div v-if="loading" class="text-center py-8">
      <div
        class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"
      ></div>
    </div>

    <div v-else-if="logs.length === 0" class="text-center py-8">
      <p class="text-gray-500">Aucune activité récente</p>
    </div>

    <div v-else class="space-y-3">
      <div
        v-for="log in logs"
        :key="log.id"
        class="bg-gray-900 border border-gray-700 rounded-xl p-4 hover:border-purple-500/50 transition-all"
      >
        <div class="flex items-start gap-4">
          <div
            :class="[
              'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
              getActionColor(log.action),
            ]"
          >
            <component
              :is="getActionIcon(log.action)"
              class="w-5 h-5 text-white"
            />
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <span class="font-semibold text-white">{{ log.userEmail }}</span>
              <span class="text-gray-500 text-sm">•</span>
              <span class="text-gray-400 text-sm">{{
                getActionLabel(log.action)
              }}</span>
            </div>

            <div class="text-sm text-gray-500">
              {{ log.resource }}
              <span v-if="log.resourceId" class="font-mono text-xs">{{
                log.resourceId.slice(0, 8)
              }}</span>
            </div>

            <div class="text-xs text-gray-600 mt-1">
              {{ formatTimestamp(log.timestamp) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { h } from "vue";

const props = defineProps({
  logs: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const getActionColor = (action) => {
  if (action.includes("create") || action.includes("add"))
    return "bg-emerald-600";
  if (action.includes("delete") || action.includes("remove"))
    return "bg-rose-600";
  if (action.includes("update") || action.includes("edit"))
    return "bg-amber-600";
  if (action.includes("login")) return "bg-blue-600";
  if (action.includes("lock")) return "bg-purple-600";
  return "bg-gray-600";
};

const getActionIcon = (action) => {
  if (action.includes("create") || action.includes("add")) {
    return () =>
      h("svg", { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, [
        h("path", {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "2",
          d: "M12 4v16m8-8H4",
        }),
      ]);
  }
  if (action.includes("delete") || action.includes("remove")) {
    return () =>
      h("svg", { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, [
        h("path", {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "2",
          d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16",
        }),
      ]);
  }
  if (action.includes("update") || action.includes("edit")) {
    return () =>
      h("svg", { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, [
        h("path", {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "2",
          d: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
        }),
      ]);
  }
  if (action.includes("login")) {
    return () =>
      h("svg", { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, [
        h("path", {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "2",
          d: "M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1",
        }),
      ]);
  }
  return () =>
    h("svg", { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, [
      h("path", {
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        "stroke-width": "2",
        d: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      }),
    ]);
};

const getActionLabel = (action) => {
  const labels = {
    create_event: "a créé un événement",
    update_event: "a modifié un événement",
    delete_event: "a supprimé un événement",
    create_product: "a créé un produit",
    update_product: "a modifié un produit",
    delete_product: "a supprimé un produit",
    login: "s'est connecté",
    register: "s'est inscrit",
    update_user_role: "a modifié un rôle",
    lock_user: "a verrouillé un compte",
    unlock_user: "a déverrouillé un compte",
  };
  return labels[action] || action;
};

const formatTimestamp = (timestamp) => {
  if (!timestamp) return "";
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const now = new Date();
  const diff = now - date;

  if (diff < 60000) return "À l'instant";

  if (diff < 3600000) {
    const mins = Math.floor(diff / 60000);
    return `Il y a ${mins} min`;
  }

  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000);
    return `Il y a ${hours}h`;
  }

  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
};
</script>
