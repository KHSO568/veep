<template>
  <NuxtLayout name="admin">
    <div>
      <div class="mb-6 flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 font-Baloo">Import en masse</h1>
          <p class="text-sm text-gray-500 mt-1">Importer plusieurs utilisateurs depuis CSV/Excel</p>
        </div>
        <NuxtLink to="/admin/users"
          class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all text-sm font-medium flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Retour
        </NuxtLink>
      </div>

      <div class="max-w-4xl mx-auto">
        <div class="flex items-center justify-center mb-8 gap-4">
          <div v-for="(stepItem, index) in steps" :key="stepItem.id" class="flex items-center">
            <div class="flex items-center gap-3">
              <div :class="[
                'w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all',
                step >= index + 1 ? 'bg-veep-orange border-veep-orange text-white' : 'bg-white border-gray-300 text-gray-500'
              ]">{{ index + 1 }}</div>
              <span :class="['font-medium text-sm', step >= index + 1 ? 'text-gray-900' : 'text-gray-500']">
                {{ stepItem.label }}
              </span>
            </div>
            <div v-if="index < steps.length - 1" :class="[
              'w-16 h-0.5 mx-4',
              step > index + 1 ? 'bg-veep-orange' : 'bg-gray-200'
            ]"></div>
          </div>
        </div>

        <FileUploader v-if="step === 1" :file="file" :parsing="parsing" @download-template="downloadTemplate"
          @file-selected="(f) => (file = f)" @clear-file="file = null" @parse="handleParse" />

        <ImportPreview v-if="step === 2" :previewData="previewData" :errors="errors" :validCount="validCount"
          @back="step = 1" @import="startImport" />

        <ImportProgress v-if="step === 3" :imported="imported" :total="validCount" :importing="importing"
          :importErrors="importErrors" />
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { collection, addDoc } from 'firebase/firestore';

definePageMeta({ middleware: 'admin' });

const { $db } = useNuxtApp();
const { logAction } = useAuditLog();
const { parseFile, validateData } = useCsvParser();

const steps = [
  { id: 1, label: 'Télécharger' },
  { id: 2, label: 'Vérifier' },
  { id: 3, label: 'Importer' }
];

const step = ref(1);
const file = ref(null);
const parsing = ref(false);
const previewData = ref([]);
const errors = ref([]);
const importing = ref(false);
const imported = ref(0);
const importErrors = ref([]);

const validCount = computed(() => previewData.value.filter((row) => row.valid).length);

const downloadTemplate = () => {
  const csv = 'email,displayName,role\\nexample@domain.com,John Doe,user\\nadmin@domain.com,Admin User,admin';
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'user-import-template.csv';
  a.click();
  URL.revokeObjectURL(url);
};

const handleParse = async () => {
  if (!file.value) return;

  parsing.value = true;
  try {
    const { previewData: parsedData, errors: parseErrors } = await parseFile(file.value);
    previewData.value = await validateData(parsedData, $db);
    errors.value = parseErrors;
    step.value = 2;
  } catch (error) {
    console.error('Error parsing file:', error);
  } finally {
    parsing.value = false;
  }
};

const startImport = () => {
  step.value = 3;
};

const importUsers = async () => {
  importing.value = true;
  imported.value = 0;
  importErrors.value = [];

  const validUsers = previewData.value.filter((row) => row.valid);

  for (const user of validUsers) {
    try {
      await addDoc(collection($db, 'users'), {
        email: user.email,
        displayName: user.displayName || '',
        role: user.role,
        createdAt: new Date(),
        loginAttempts: 0,
        isLocked: false,
        importedAt: new Date()
      });

      await logAction('user_imported', 'user', user.email);
      imported.value++;
    } catch (error) {
      console.error(`Error importing ${user.email}:`, error);
      importErrors.value.push(`${user.email}: ${error.message}`);
    }
  }

  importing.value = false;
};

watch(step, (newStep) => {
  if (newStep === 3 && !importing.value && imported.value === 0) {
    importUsers();
  }
});
</script>
