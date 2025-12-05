import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { ref } from 'vue';
import { collection, query, where, getDocs } from 'firebase/firestore';

export const useCsvParser = () => {
  const file = ref(null);
  const parsing = ref(false);
  const previewData = ref([]);
  const errors = ref([]);

  const parseCSV = (fileToparse) => {
    return new Promise((resolve) => {
      Papa.parse(fileToparse, {
        header: true,
        complete: (results) => {
          previewData.value = results.data.filter((row) => row.email);
          resolve();
        },
        error: (error) => {
          errors.value.push(`Erreur CSV: ${error.message}`);
          resolve();
        },
      });
    });
  };

  const parseExcel = (fileToparse) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(firstSheet);
          previewData.value = jsonData.filter((row) => row.email);
          resolve();
        } catch (error) {
          errors.value.push(`Erreur Excel: ${error.message}`);
          resolve();
        }
      };
      reader.readAsArrayBuffer(fileToparse);
    });
  };

  const parseFile = async (fileToparse) => {
    if (!fileToparse) return;

    parsing.value = true;
    errors.value = [];
    previewData.value = [];

    try {
      const fileExt = fileToparse.name.split('.').pop().toLowerCase();

      if (fileExt === 'csv') {
        await parseCSV(fileToparse);
      } else if (fileExt === 'xlsx' || fileExt === 'xls') {
        await parseExcel(fileToparse);
      }
    } catch (error) {
      console.error('Error parsing file:', error);
      errors.value.push('Erreur lors de la lecture du fichier');
    } finally {
      parsing.value = false;
    }

    return { previewData: previewData.value, errors: errors.value };
  };

  const validateData = async (data, db) => {
    errors.value = [];
    const validRoles = ['admin', 'moderator', 'user'];

    const emails = data.map((row) => row.email);
    const existingUsersQuery = query(
      collection(db, 'users'),
      where('email', 'in', emails.slice(0, 10))
    );
    const existingSnap = await getDocs(existingUsersQuery);
    const existingEmails = new Set(existingSnap.docs.map((doc) => doc.data().email));

    return data.map((row, index) => {
      const rowErrors = [];

      if (!row.email || !row.email.includes('@')) rowErrors.push('Email invalide');
      if (existingEmails.has(row.email)) rowErrors.push('Email existe déjà');
      if (row.role && !validRoles.includes(row.role)) rowErrors.push(`Rôle invalide: ${row.role}`);
      if (!row.role) row.role = 'user';

      const isValid = rowErrors.length === 0;
      if (!isValid) errors.value.push(`Ligne ${index + 1}: ${rowErrors.join(', ')}`);

      return { ...row, valid: isValid, error: rowErrors.join(', ') };
    });
  };

  return {
    file,
    parsing,
    previewData,
    errors,
    parseFile,
    validateData
  };
};
