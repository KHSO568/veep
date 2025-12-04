<template>
    <NuxtLayout name="admin">
        <div>
            <div class="mb-6">
                <div class="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <NuxtLink to="/admin" class="hover:text-veep-orange">Cartes</NuxtLink>
                    <span>›</span>
                    <span class="text-gray-900 font-medium">Stock</span>
                </div>
            </div>

            <div v-if="stocks.length === 0 && !loading" class="flex flex-col items-center justify-center py-20">
                <div class="mb-8">
                    <img src="/img_shopping.webp" alt="Store" class="w-auto h-96" />
                </div>
                <p class="text-gray-600 text-lg mb-6">Créez votre premier Stock de carte !</p>
                <button @click="showModal = true"
                    class="px-6 py-3 bg-veep-orange text-white rounded-full font-medium hover:bg-veep-orange-dark transition-colors">
                    Enregistrer un stock
                </button>
            </div>

            <div v-else-if="stocks.length > 0" class="space-y-6">
                <div class="grid grid-cols-4 gap-4">
                    <div class="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <div class="flex items-center justify-between mb-2">
                            <span class="text-sm text-gray-600">Total non concerné</span>
                            <svg class="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" />
                            </svg>
                        </div>
                        <div class="text-2xl font-bold text-gray-900">{{ stats.totalNonConcerne.toLocaleString() }}
                            <span class="text-sm font-normal">FCFA</span>
                        </div>
                    </div>

                    <div class="bg-green-50 rounded-lg p-4 border border-green-200">
                        <div class="flex items-center justify-between mb-2">
                            <span class="text-sm text-gray-600">Non concerné</span>
                            <svg class="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" />
                            </svg>
                        </div>
                        <div class="text-2xl font-bold text-gray-900">{{ stats.nonConcerne.toLocaleString() }} <span
                                class="text-sm font-normal">FCFA</span></div>
                    </div>

                    <div class="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                        <div class="flex items-center justify-between mb-2">
                            <span class="text-sm text-gray-600">Livraison en attente</span>
                            <svg class="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" />
                            </svg>
                        </div>
                        <div class="text-2xl font-bold text-gray-900">{{ stats.livraisonEnAttente.toLocaleString() }}
                            <span class="text-sm font-normal">FCFA</span>
                        </div>
                    </div>

                    <div class="bg-red-50 rounded-lg p-4 border border-red-200">
                        <div class="flex items-center justify-between mb-2">
                            <span class="text-sm text-gray-600">Mal imprimées</span>
                            <svg class="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" />
                            </svg>
                        </div>
                        <div class="text-2xl font-bold text-gray-900">{{ stats.malImprimees.toLocaleString() }} <span
                                class="text-sm font-normal">FCFA</span></div>
                    </div>
                </div>

                <div class="flex justify-end">
                    <button @click="showModal = true"
                        class="px-6 py-2.5 bg-veep-orange text-white rounded-lg font-medium hover:bg-veep-orange-dark transition-colors">
                        + Enregistrer un stock
                    </button>
                </div>

                <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <table class="w-full">
                        <thead class="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">STATUS DU
                                    STOCK</th>
                                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                                    EMPLACEMENT</th>
                                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">PLAGE</th>
                                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">QTE
                                    DISPONIBLES</th>
                                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">QTE
                                    ACTIVEES</th>
                                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">QTE
                                    RESERVES</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100">
                            <tr v-for="stock in stocks" :key="stock.id" class="hover:bg-gray-50 transition-colors">
                                <td class="px-6 py-4">
                                    <div class="flex items-center gap-2">
                                        <div class="w-3 h-3 rounded-full" :class="getStatusColor(stock.status)"></div>
                                        <span class="text-sm font-medium">Stock {{ stock.name }}</span>
                                    </div>
                                </td>
                                <td class="px-6 py-4">
                                    <span class="text-sm text-gray-900">{{ stock.location }}</span>
                                </td>
                                <td class="px-6 py-4">
                                    <span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                        {{ stock.rangeStart }} - {{ stock.rangeEnd }}
                                    </span>
                                </td>
                                <td class="px-6 py-4">
                                    <span class="flex items-center gap-1 text-sm">
                                        <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clip-rule="evenodd" />
                                        </svg>
                                        {{ stock.qtyAvailable }}
                                    </span>
                                </td>
                                <td class="px-6 py-4">
                                    <span class="text-sm text-gray-900">{{ stock.qtyActivated }}</span>
                                </td>
                                <td class="px-6 py-4">
                                    <span class="text-sm text-gray-900">{{ stock.qtyReserved }}</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div v-if="loading" class="flex justify-center items-center py-20">
                <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-veep-orange"></div>
            </div>

            <div v-if="showModal"
                class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                @click.self="showModal = false">
                <div class="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="text-xl font-bold text-gray-900">Enregistrer un stock</h3>
                        <button @click="showModal = false" class="text-gray-400 hover:text-gray-600">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <form @submit.prevent="createStock" class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Nom du stock</label>
                            <input v-model="formData.name" type="text" placeholder="Stock Tunis" required
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-veep-orange focus:border-transparent" />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Choisir l'emplacement du
                                Stock</label>
                            <div class="relative">
                                <select v-model="formData.location" required
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-veep-orange focus:border-transparent appearance-none">
                                    <option value="">Sélectionner</option>
                                    <option value="Benin">Bénin</option>
                                    <option value="Togo">Togo</option>
                                    <option value="Cote d'Ivoire">Côte d'Ivoire</option>
                                </select>
                                <svg class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Plage de Cartes</label>
                            <div class="grid grid-cols-3 gap-2 items-center">
                                <input v-model.number="formData.rangeStart" type="number" placeholder="0001" required
                                    class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-veep-orange focus:border-transparent" />
                                <div class="text-center text-gray-500 font-medium">à</div>
                                <input v-model.number="formData.rangeEnd" type="number" placeholder="9999" required
                                    class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-veep-orange focus:border-transparent" />
                            </div>
                            <p class="text-xs text-gray-500 mt-1">Ex: 0001 à 9999 ou cumuler de 10 cartes</p>
                        </div>

                        <div>
                            <label class="flex items-center gap-2 text-sm">
                                <input v-model="formData.billOfLading" type="checkbox"
                                    class="w-4 h-4 text-veep-orange border-gray-300 rounded focus:ring-veep-orange" />
                                <span class="text-gray-700">Sortir une feuille de Connaissement</span>
                            </label>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Nom de la compagnie</label>
                            <input v-model="formData.companyName" type="text" placeholder="VEEPCRAFT"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-veep-orange focus:border-transparent" />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
                            <input v-model="formData.address" type="text"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-veep-orange focus:border-transparent" />
                        </div>

                        <div class="flex gap-3 pt-4">
                            <button type="button" @click="showModal = false"
                                class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                                Annuler
                            </button>
                            <button type="submit"
                                class="flex-1 px-4 py-2 bg-veep-orange text-white rounded-lg hover:bg-veep-orange-dark transition-colors font-medium">
                                Enregistrer le stock
                            </button>
                        </div>
                    </form>
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
    addDoc,
    getDocs,
    serverTimestamp,
    query,
    orderBy
} from "firebase/firestore";

definePageMeta({
    middleware: "admin",
    layout: false
});

const { $db } = useNuxtApp();
const { user } = useAuth();

let logAction = () => Promise.resolve();
try {
    const auditLog = useAuditLog();
    if (auditLog && auditLog.logAction) {
        logAction = auditLog.logAction;
    }
} catch (e) {
    console.warn("Audit log not available:", e);
}

const stocks = ref([]);
const loading = ref(true);
const showModal = ref(false);
const message = ref("");
const messageType = ref("success");

const formData = ref({
    name: "",
    location: "",
    rangeStart: null,
    rangeEnd: null,
    billOfLading: false,
    companyName: "",
    address: ""
});

const stats = computed(() => {
    return {
        totalNonConcerne: 200000,
        nonConcerne: 200000,
        livraisonEnAttente: 200000,
        malImprimees: 200000
    };
});

const getStatusColor = (status) => {
    const colors = {
        active: 'bg-green-500',
        pending: 'bg-yellow-500',
        inactive: 'bg-red-500'
    };
    return colors[status] || 'bg-gray-500';
};

const showMessage = (text, type = "success") => {
    message.value = text;
    messageType.value = type;
    setTimeout(() => (message.value = ""), 3000);
};

const createStock = async () => {
    try {
        // Ensure we have a valid user ID
        const { $auth } = useNuxtApp();
        const currentUserId = user.value?.uid || $auth.currentUser?.uid;
        
        if (!currentUserId) {
            showMessage("Erreur: Utilisateur non connecté", "error");
            return;
        }

        const stockData = {
            userId: currentUserId,
            name: formData.value.name,
            location: formData.value.location,
            rangeStart: formData.value.rangeStart,
            rangeEnd: formData.value.rangeEnd,
            billOfLading: formData.value.billOfLading,
            companyName: formData.value.companyName,
            address: formData.value.address,
            status: 'active',
            qtyAvailable: formData.value.rangeEnd - formData.value.rangeStart + 1,
            qtyActivated: 0,
            qtyReserved: 0,
            createdAt: serverTimestamp()
        };

        const docRef = await addDoc(collection($db, "stocks"), stockData);

        try {
            await logAction("create_stock", "stock", docRef.id, {
                name: stockData.name,
                location: stockData.location
            });
        } catch (logError) {
            console.warn("Failed to log action:", logError);
        }

        stocks.value.unshift({
            id: docRef.id,
            ...stockData,
            createdAt: new Date()
        });

        showMessage("Stock créé avec succès");
        showModal.value = false;

        formData.value = {
            name: "",
            location: "",
            rangeStart: null,
            rangeEnd: null,
            billOfLading: false,
            companyName: "",
            address: ""
        };
    } catch (error) {
        console.error("Error creating stock:", error);
        showMessage(`Erreur: ${error.message || "Impossible de créer le stock"}`, "error");
    }
};

onMounted(async () => {
    try {
        const q = query(collection($db, "stocks"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        stocks.value = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error("Error loading stocks:", error);
        showMessage(`Erreur: ${error.message || "Impossible de charger les stocks"}`, "error");
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
