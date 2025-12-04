<template>
  <div v-if="role" :class="[
    'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold',
    roleClasses[role],
  ]">
    <component :is="roleIcons[role]" class="w-4 h-4" />
    <span>{{ roleLabels[role] }}</span>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  role: {
    type: String,
    required: true,
    validator: (value) => ["admin", "moderator", "user"].includes(value),
  },
});

const roleClasses = {
  admin: "bg-red-100 text-red-700",
  moderator: "bg-amber-100 text-amber-700",
  user: "bg-blue-100 text-blue-700",
};

const roleLabels = {
  admin: "Admin",
  moderator: "Moderator",
  user: "User",
};

const roleIcons = {
  admin: () =>
    h(
      "svg",
      {
        class: "w-4 h-4",
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24",
      },
      [
        h("path", {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "2",
          d: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
        }),
      ]
    ),
  moderator: () =>
    h(
      "svg",
      {
        class: "w-4 h-4",
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24",
      },
      [
        h("path", {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "2",
          d: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z",
        }),
      ]
    ),
  user: () =>
    h(
      "svg",
      {
        class: "w-4 h-4",
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24",
      },
      [
        h("path", {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "2",
          d: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
        }),
      ]
    ),
};
</script>
