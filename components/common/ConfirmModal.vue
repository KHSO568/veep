<template>
    <div v-if="isOpen"
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
            <h3 class="text-2xl font-bold mb-4 text-center text-white">
                {{ title }}
            </h3>
            <p class="text-gray-300 mb-8 text-center text-lg leading-relaxed">
                {{ message }}
            </p>
            <div class="flex gap-4">
                <button @click="$emit('cancel')"
                    class="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-6 py-4 rounded-2xl transition-all font-semibold text-lg">
                    {{ cancelText }}
                </button>
                <button @click="$emit('confirm')"
                    class="flex-1 bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-700 hover:to-orange-700 text-white px-6 py-4 rounded-2xl transition-all font-semibold text-lg shadow-lg">
                    {{ confirmText }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    isOpen: {
        type: Boolean,
        required: true
    },
    title: {
        type: String,
        default: 'Attention'
    },
    message: {
        type: String,
        required: true
    },
    confirmText: {
        type: String,
        default: 'Confirmer'
    },
    cancelText: {
        type: String,
        default: 'Annuler'
    }
});

defineEmits(['confirm', 'cancel']);
</script>
