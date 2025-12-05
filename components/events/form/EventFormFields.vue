<template>
    <div class="space-y-4">
        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Titre de l'événement</label>
            <input :value="title" @input="$emit('update:title', $event.target.value)" type="text" required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-veep-orange focus:border-transparent"
                placeholder="Ex: Concert de fin d'année" />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input :value="date" @input="$emit('update:date', $event.target.value)" type="date" required
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-veep-orange focus:border-transparent" />
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Prix du ticket (FCFA)</label>
                <input :value="price" @input="$emit('update:price', $event.target.value)" type="number" min="0" required
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-veep-orange focus:border-transparent"
                    placeholder="Ex: 5000" />
            </div>
        </div>

        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Lieu</label>
            <input :value="location" @input="$emit('update:location', $event.target.value)" type="text" required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-veep-orange focus:border-transparent"
                placeholder="Ex: Palais des Congrès, Cotonou" />
        </div>
    </div>
</template>

<script setup>
defineProps({
    title: String,
    date: String,
    price: [String, Number],
    location: String
});

defineEmits(['update:title', 'update:date', 'update:price', 'update:location']);
</script>
