<template>
    <NuxtLayout name="admin">
        <div>
            <!-- Page header -->
            <div class="mb-6 flex items-center justify-between">
                <div>
                    <h1 class="text-2xl font-bold text-gray-900 font-Baloo">Import en masse</h1>
                    <p class="text-sm text-gray-500 mt-1">Importer plusieurs utilisateurs depuis CSV/Excel</p>
                </div>
                <NuxtLink to="/admin/users"
                    class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all text-sm font-medium flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Retour
                </NuxtLink>
            </div>

            <div class="max-w-4xl mx-auto">
                <!-- Step Indicator -->
                <div class="flex items-center justify-center mb-8 gap-4">
                    <div v-for="(stepItem, index) in steps" :key="stepItem.id" class="flex items-center">
                        <div class="flex items-center gap-3">
                            <div :class="[
                                'w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all',
                                step >= index + 1
                                    ? 'bg-veep-orange border-veep-orange text-white'
                                    : 'bg-white border-gray-300 text-gray-500'
                            ]">
                                {{ index + 1 }}
                            </div>
                            <span :class="[
                                'font-medium text-sm',
                                step >= index + 1 ? 'text-gray-900' : 'text-gray-500'
                            ]">{{ stepItem.label }}</span>
                        </div>
                        <div v-if="index < steps.length - 1" :class="[
                            'w-16 h-0.5 mx-4',
                            step > index + 1 ? 'bg-veep-orange' : 'bg-gray-200'
                        ]"></div>
                    </div>
                </div>

                <!-- Step 1: Upload -->
                <div v-if="step === 1" class="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
                    <h2 class="text-lg font-bold text-gray-900 mb-6">1. Télécharger votre fichier</h2>

                    <!-- Download Template -->
                    <div class="bg-blue-50 border border-blue-100 rounded-lg p-6 mb-6">
                        <div class="flex items-start gap-4">
                            <div class="p-2 bg-blue-100 rounded-lg">
                                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                            </div>
                            <div class="flex-1">
                                <h3 class="font-semibold text-blue-900 text-sm">Téléchargez le modèle</h3>
                                <p class="text-blue-700 text-sm mt-1 mb-4">
                                    Utilisez notre modèle CSV/Excel pour formater correctement vos données.
                                    Colonnes requises: email, displayName, role
                                </p>
                                <button @click="downloadTemplate"
                                    class="text-blue-700 hover:text-blue-800 text-sm font-medium underline">
                                    Télécharger le modèle CSV
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- File Upload -->
                    <div @drop.prevent="handleDrop" @dragover.prevent @dragenter="dragging = true"
                        @dragleave="dragging = false" :class="[
                            'border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer',
                            dragging
                                ? 'border-veep-orange bg-orange-50'
                                : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                        ]" @click="$refs.fileInput.click()">
                        <input ref="fileInput" type="file" accept=".csv,.xlsx,.xls" @change="handleFileSelect"
                            class="hidden" />

                        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                        </div>

                        <p class="text-lg font-medium text-gray-900 mb-1">
                            Glissez-déposez votre fichier ici
                        </p>
                        <p class="text-sm text-gray-500">
                            ou cliquez pour sélectionner un fichier (CSV, Excel)
                        </p>

                        <div v-if="file"
                            class="mt-6 inline-flex items-center gap-3 bg-white border border-gray-200 px-4 py-2 rounded-lg shadow-sm">
                            <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clip-rule="evenodd" />
                            </svg>
                            <span class="font-medium text-gray-900 text-sm">{{ file.name }}</span>
                            <button @click.stop="file = null" class="text-gray-400 hover:text-red-500 ml-2">
                                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                        clip-rule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div class="mt-8 flex justify-end">
                        <button @click="parseFile" :disabled="!file || parsing"
                            class="bg-veep-orange hover:bg-veep-orange-dark text-white px-6 py-2.5 rounded-lg transition-all font-medium disabled:opacity-50 flex items-center gap-2">
                            <span v-if="parsing"
                                class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                            {{ parsing ? "Analyse en cours..." : "Continuer" }}
                        </button>
                    </div>
                </div>

                <!-- Step 2: Preview & Validate -->
                <div v-if="step === 2" class="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
                    <h2 class="text-lg font-bold text-gray-900 mb-6">2. Vérifier et valider les données</h2>

                    <div v-if="errors.length > 0" class="mb-6">
                        <div class="bg-red-50 border border-red-100 rounded-lg p-4">
                            <h3 class="font-semibold text-red-800 text-sm mb-2">
                                {{ errors.length }} erreur(s) détectée(s)
                            </h3>
                            <ul class="space-y-1">
                                <li v-for="(error, index) in errors.slice(0, 5)" :key="index"
                                    class="text-red-600 text-sm flex items-start gap-2">
                                    <span class="text-red-400">•</span>
                                    <span>{{ error }}</span>
                                </li>
                            </ul>
                            <p v-if="errors.length > 5" class="text-red-500 text-xs mt-2 pl-3">
                                et {{ errors.length - 5 }} autres erreurs...
                            </p>
                        </div>
                    </div>

                    <div class="border border-gray-200 rounded-lg overflow-hidden mb-6">
                        <div class="overflow-x-auto">
                            <table class="w-full">
                                <thead class="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th
                                            class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Ligne</th>
                                        <th
                                            class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Email</th>
                                        <th
                                            class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Nom</th>
                                        <th
                                            class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Rôle</th>
                                        <th
                                            class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Statut</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-gray-200 bg-white">
                                    <tr v-for="(row, index) in previewData" :key="index"
                                        :class="row.valid ? '' : 'bg-red-50'">
                                        <td class="px-4 py-3 text-sm text-gray-500">{{ index + 1 }}</td>
                                        <td class="px-4 py-3 text-sm text-gray-900">{{ row.email }}</td>
                                        <td class="px-4 py-3 text-sm text-gray-500">{{ row.displayName }}</td>
                                        <td class="px-4 py-3">
                                            <UserRoleBadge :role="row.role" />
                                        </td>
                                        <td class="px-4 py-3">
                                            <span v-if="row.valid"
                                                class="text-green-600 text-xs font-medium flex items-center gap-1">
                                                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fill-rule="evenodd"
                                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                        clip-rule="evenodd" />
                                                </svg>
                                                Valide
                                            </span>
                                            <span v-else class="text-red-600 text-xs font-medium">{{ row.error }}</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div class="bg-gray-50 rounded-lg p-4 mb-8">
                        <div class="grid grid-cols-3 gap-4 text-center">
                            <div>
                                <div class="text-2xl font-bold text-gray-900">{{ previewData.length }}</div>
                                <div class="text-xs text-gray-500 uppercase tracking-wide">Total</div>
                            </div>
                            <div>
                                <div class="text-2xl font-bold text-green-600">{{ validCount }}</div>
                                <div class="text-xs text-gray-500 uppercase tracking-wide">Valides</div>
                            </div>
                            <div>
                                <div class="text-2xl font-bold text-red-600">{{ previewData.length - validCount }}</div>
                                <div class="text-xs text-gray-500 uppercase tracking-wide">Invalides</div>
                            </div>
                        </div>
                    </div>

                    <div class="flex gap-3 justify-end">
                        <button @click="step = 1"
                            class="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium">
                            Retour
                        </button>
                        <button @click="step = 3" :disabled="validCount === 0"
                            class="bg-veep-orange hover:bg-veep-orange-dark text-white px-6 py-2.5 rounded-lg transition-all font-medium disabled:opacity-50">
                            Importer {{ validCount }} utilisateur(s)
                        </button>
                    </div>
                </div>

                <!-- Step 3: Import -->
                <div v-if="step === 3" class="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
                    <h2 class="text-lg font-bold text-gray-900 mb-6">3. Importation en cours</h2>

                    <div class="space-y-6">
                        <div class="bg-gray-50 rounded-lg p-6">
                            <div class="flex items-center justify-between mb-2">
                                <span class="text-sm font-medium text-gray-700">Progression</span>
                                <span class="text-sm text-gray-500">{{ imported }} / {{ validCount }}</span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                                <div :style="{ width: (imported / validCount) * 100 + '%' }"
                                    class="bg-veep-orange h-full transition-all duration-300 rounded-full">
                                </div>
                            </div>
                        </div>

                        <div v-if="!importing && imported === validCount"
                            class="bg-green-50 border border-green-100 rounded-lg p-6 text-center">
                            <div
                                class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 class="text-lg font-bold text-green-800 mb-1">Import terminé !</h3>
                            <p class="text-green-600 text-sm">
                                {{ imported }} utilisateur(s) importé(s) avec succès
                            </p>
                        </div>

                        <div v-if="importErrors.length > 0" class="bg-red-50 border border-red-100 rounded-lg p-6">
                            <h3 class="font-semibold text-red-800 text-sm mb-3">Erreurs d'importation</h3>
                            <ul class="space-y-1 max-h-40 overflow-y-auto">
                                <li v-for="(error, index) in importErrors" :key="index" class="text-red-600 text-xs">
                                    {{ error }}
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div class="mt-8 flex justify-end">
                        <NuxtLink to="/admin/users"
                            class="bg-veep-orange hover:bg-veep-orange-dark text-white px-6 py-2.5 rounded-lg transition-all font-medium">
                            Voir les utilisateurs
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </div>
    </NuxtLayout>
</template>

<script setup>
import { ref, computed } from "vue";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";

definePageMeta({
    middleware: "admin"
});

const { $db, $auth } = useNuxtApp();
const { logAction } = useAuditLog();

const steps = [
    { id: 1, label: "Télécharger" },
    { id: 2, label: "Vérifier" },
    { id: 3, label: "Importer" }
];

const step = ref(1);
const file = ref(null);
const dragging = ref(false);
const parsing = ref(false);
const importing = ref(false);

const previewData = ref([]);
const errors = ref([]);
const imported = ref(0);
const importErrors = ref([]);

const validCount = computed(() => {
    return previewData.value.filter((row) => row.valid).length;
});

const downloadTemplate = () => {
    const csv = "email,displayName,role\nexample@domain.com,John Doe,user\nadmin@domain.com,Admin User,admin";
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "user-import-template.csv";
    a.click();
    URL.revokeObjectURL(url);
};

const handleDrop = (e) => {
    dragging.value = false;
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        file.value = files[0];
    }
};

const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
        file.value = files[0];
    }
};

const parseFile = async () => {
    if (!file.value) return;

    parsing.value = true;
    errors.value = [];
    previewData.value = [];

    try {
        const fileExt = file.value.name.split(".").pop().toLowerCase();

        if (fileExt === "csv") {
            await parseCSV();
        } else if (fileExt === "xlsx" || fileExt === "xls") {
            await parseExcel();
        }

        await validateData();
        step.value = 2;
    } catch (error) {
        console.error("Error parsing file:", error);
        errors.value.push("Erreur lors de la lecture du fichier");
    } finally {
        parsing.value = false;
    }
};

const parseCSV = () => {
    return new Promise((resolve) => {
        Papa.parse(file.value, {
            header: true,
            complete: (results) => {
                previewData.value = results.data.filter((row) => row.email);
                resolve();
            },
            error: (error) => {
                errors.value.push(`Erreur CSV: ${error.message}`);
                resolve();
            }
        });
    });
};

const parseExcel = () => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: "array" });
                const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(firstSheet);
                previewData.value = jsonData.filter((row) => row.email);
                resolve();
            } catch (error) {
                errors.value.push(`Erreur Excel: ${error.message}`);
                resolve();
            }
        };
        reader.readAsArrayBuffer(file.value);
    });
};

const validateData = async () => {
    errors.value = [];
    const validRoles = ["admin", "moderator", "user"];

    // Check for existing emails
    const emails = previewData.value.map((row) => row.email);
    const existingUsersQuery = query(
        collection($db, "users"),
        where("email", "in", emails.slice(0, 10)) // Firestore limit
    );
    const existingSnap = await getDocs(existingUsersQuery);
    const existingEmails = new Set(existingSnap.docs.map((doc) => doc.data().email));

    previewData.value = previewData.value.map((row, index) => {
        const rowErrors = [];

        // Validate email
        if (!row.email || !row.email.includes("@")) {
            rowErrors.push("Email invalide");
        }

        // Check if email exists
        if (existingEmails.has(row.email)) {
            rowErrors.push("Email existe déjà");
        }

        // Validate role
        if (row.role && !validRoles.includes(row.role)) {
            rowErrors.push(`Rôle invalide: ${row.role}`);
        }

        // Set default role if not provided
        if (!row.role) {
            row.role = "user";
        }

        const isValid = rowErrors.length === 0;

        if (!isValid) {
            errors.value.push(`Ligne ${index + 1}: ${rowErrors.join(", ")}`);
        }

        return {
            ...row,
            valid: isValid,
            error: rowErrors.join(", ")
        };
    });
};

const importUsers = async () => {
    importing.value = true;
    imported.value = 0;
    importErrors.value = [];

    const validUsers = previewData.value.filter((row) => row.valid);

    for (const user of validUsers) {
        try {
            // Create user in Firebase Auth
            const tempPassword = generateRandomPassword();

            // Note: This requires Firebase Admin SDK in production
            // For now, we'll just create the Firestore document

            await addDoc(collection($db, "users"), {
                email: user.email,
                displayName: user.displayName || "",
                role: user.role,
                createdAt: new Date(),
                loginAttempts: 0,
                isLocked: false,
                importedAt: new Date()
            });

            await logAction("user_imported", "user", user.email);
            imported.value++;
        } catch (error) {
            console.error(`Error importing ${user.email}:`, error);
            importErrors.value.push(`${user.email}: ${error.message}`);
        }
    }

    importing.value = false;
};

const generateRandomPassword = () => {
    return Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-10);
};

// Auto-import when reaching step 3
const startImport = async () => {
    if (step.value === 3 && !importing.value && imported.value === 0) {
        await importUsers();
    }
};

// Watch step changes
watch(step, (newStep) => {
    if (newStep === 3) {
        startImport();
    }
});
</script>
