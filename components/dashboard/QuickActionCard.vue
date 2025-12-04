<template>
    <NuxtLink :to="to" :class="[
        'bg-white rounded-lg border border-gray-200 p-6 transition-all group',
        `hover:border-${color}-500`
    ]">
        <div class="flex items-center gap-4">
            <div :class="[
                'w-12 h-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform',
                bgColorClass
            ]">
                <slot name="icon">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                </slot>
            </div>
            <div>
                <h3 :class="[
                    'font-semibold text-gray-900 transition-colors',
                    `group-hover:text-${color}-600`
                ]">
                    {{ title }}
                </h3>
                <p class="text-sm text-gray-500">{{ description }}</p>
            </div>
        </div>
    </NuxtLink>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    to: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    color: {
        type: String,
        default: 'veep-orange',
        validator: (value) => ['veep-orange', 'green', 'blue'].includes(value)
    }
});

const bgColorClass = computed(() => {
    const colors = {
        'veep-orange': 'bg-veep-orange',
        'green': 'bg-green-500',
        'blue': 'bg-blue-500'
    };
    return colors[props.color] || colors['veep-orange'];
});
</script>
