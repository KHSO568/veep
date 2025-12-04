<template>
    <div class="bg-white rounded-lg border border-gray-200 p-6">
        <div class="flex items-center justify-between">
            <div>
                <p class="text-sm font-medium text-gray-500 uppercase">{{ title }}</p>
                <p class="text-3xl font-bold text-gray-900 mt-2">{{ value }}</p>
            </div>
            <div :class="[
                'w-12 h-12 rounded-lg flex items-center justify-center',
                iconBgClass
            ]">
                <component :is="iconComponent" class="w-6 h-6" :class="iconColorClass" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    title: {
        type: String,
        required: true
    },
    value: {
        type: [String, Number],
        required: true
    },
    icon: {
        type: String,
        default: 'users',
        validator: (value) => ['users', 'events', 'products', 'actions'].includes(value)
    },
    color: {
        type: String,
        default: 'blue',
        validator: (value) => ['blue', 'purple', 'green', 'orange'].includes(value)
    }
});

const iconBgClass = computed(() => {
    const colors = {
        blue: 'bg-blue-50',
        purple: 'bg-purple-50',
        green: 'bg-green-50',
        orange: 'bg-orange-50'
    };
    return colors[props.color] || colors.blue;
});

const iconColorClass = computed(() => {
    const colors = {
        blue: 'text-blue-600',
        purple: 'text-purple-600',
        green: 'text-green-600',
        orange: 'text-veep-orange'
    };
    return colors[props.color] || colors.blue;
});

const iconComponent = computed(() => {
    const icons = {
        users: {
            render() {
                return (
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                );
            }
        },
        events: {
            render() {
                return (
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                );
            }
        },
        products: {
            render() {
                return (
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                );
            }
        },
        actions: {
            render() {
                return (
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                );
            }
        }
    };
    return icons[props.icon] || icons.users;
});
</script>
