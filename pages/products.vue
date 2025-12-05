<template>
  <div class="min-h-screen bg-gray-900 text-gray-100">
    <AppHeader />

    <div class="max-w-7xl mx-auto px-6 py-8">
      <ToastNotification :message="message" :type="messageType" />
      <ConfirmModal
        :isOpen="showConfirm"
        :message="confirmMessage"
        @confirm="confirmAction"
        @cancel="cancelAction"
      />

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <ProductForm
          :name="name"
          :price="price"
          :description="description"
          :imagePreview="imagePreview"
          :editMode="editMode"
          @update:name="name = $event"
          @update:price="price = $event"
          @update:description="description = $event"
          @clickImageUpload="() => fileInput.click()"
          @clearImage="clearImage"
          @submit="submitProduct"
          @cancel="cancelEdit"
        />

        <ProductGrid
          :products="filteredProducts"
          :selectedProducts="selectedProducts"
          :searchQuery="searchQuery"
          :formatPrice="formatPrice"
          :canManageProduct="canManageProduct"
          @update:searchQuery="(val) => (searchQuery = val)"
          @toggleSelect="toggleSelection"
          @select="selectProduct"
          @edit="startEdit"
          @delete="confirmSingleDelete"
          @deleteMultiple="confirmMultipleDelete"
        />
      </div>
    </div>

    <ProductDetails
      :product="selectedProduct"
      :formatPrice="formatPrice"
      @close="selectedProduct = null"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";

import AiEditor from "~/components/AiEditor.vue";
import ProductDetails from "~/components/ProductDetails.vue";

const { $db } = useNuxtApp();
const { user, isAdmin } = useAuth();
const { logAction } = useAuditLog();

/* FORM STATE */
const name = ref("");
const price = ref(null);
const description = ref("");
const imagePreview = ref("");
const imageFile = ref(null);
const fileInput = ref(null);

const editMode = ref(false);
const editId = ref(null);

/* PRODUCTS */
const products = ref([]);
const selectedProduct = ref(null);
const selectedProducts = ref([]);
const searchQuery = ref("");

/* MESSAGE / TOAST */
const message = ref("");
const messageType = ref("success");

const showMessage = (text, type = "success") => {
  message.value = text;
  messageType.value = type;
  setTimeout(() => (message.value = ""), 3000);
};

/* CONFIRMATION MODAL */
const showConfirm = ref(false);
const confirmMessage = ref("");
let confirmCallback = null;

const confirmAction = async () => {
  showConfirm.value = false;
  if (confirmCallback) await confirmCallback();
  confirmCallback = null;
};

const cancelAction = () => {
  showConfirm.value = false;
  confirmCallback = null;
};

const openConfirm = (text, callback) => {
  confirmMessage.value = text;
  confirmCallback = callback;
  showConfirm.value = true;
};

/* FORMAT PRICE */
const formatPrice = (price) => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(price);
};

/* IMAGE HANDLING */
const onImageSelected = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  imageFile.value = file;
  const reader = new FileReader();
  reader.onload = (ev) => (imagePreview.value = ev.target.result);
  reader.readAsDataURL(file);
};

const clearImage = () => {
  imageFile.value = null;
  imagePreview.value = "";
  if (fileInput.value) fileInput.value.value = "";
};

/* SUBMIT PRODUCT */
const submitProduct = async () => {
  try {
    const data = {
      name: name.value,
      price: price.value,
      description: description.value,
      userId: user.value.uid,
      userEmail: user.value.email,
      createdAt: serverTimestamp(),
    };

    if (imagePreview.value) data.image = imagePreview.value;

    if (editMode.value) {
      await updateDoc(doc($db, "products", editId.value), data);
      await logAction("update_product", "product", editId.value, {
        name: name.value,
      });
      showMessage("Produit modifié avec succès");
    } else {
      const docRef = await addDoc(collection($db, "products"), data);
      await logAction("create_product", "product", docRef.id, {
        name: name.value,
      });
      showMessage("Produit ajouté avec succès");
    }

    resetForm();
  } catch (e) {
    console.error(e);
    showMessage("Erreur lors de la sauvegarde", "error");
  }
};

/* RESET FORM */
const resetForm = () => {
  name.value = "";
  price.value = null;
  description.value = "";
  imagePreview.value = "";
  imageFile.value = null;
  fileInput.value.value = "";
  editMode.value = false;
  editId.value = null;
};

/* EDIT PRODUCT */
const startEdit = (product) => {
  editMode.value = true;
  editId.value = product.id;

  name.value = product.name;
  price.value = product.price;
  description.value = product.description;
  imagePreview.value = product.image || "";
};

const cancelEdit = () => resetForm();

/* DELETE SINGLE PRODUCT */
const confirmSingleDelete = (product) => {
  openConfirm(`Supprimer "${product.name}" ?`, async () => {
    await deleteDoc(doc($db, "products", product.id));
    await logAction("delete_product", "product", product.id, {
      name: product.name,
    });
    showMessage("Produit supprimé", "error");
  });
};

/* DELETE MULTIPLE */
const confirmMultipleDelete = () => {
  openConfirm(
    `Supprimer ${selectedProducts.value.length} produit(s) ?`,
    async () => {
      const deletions = selectedProducts.value.map((id) =>
        deleteDoc(doc($db, "products", id))
      );
      await Promise.all(deletions);

      selectedProducts.value = [];
      showMessage("Produits supprimés", "error");
    }
  );
};

/* SELECT PRODUCT FOR DETAIL VIEW */
const selectProduct = (product) => {
  selectedProduct.value = product;
};

/* FILTERED PRODUCTS */
const filteredProducts = computed(() => {
  if (!searchQuery.value.trim()) return products.value;
  return products.value.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

/* ON MOUNT : REALTIME FIRESTORE */
onMounted(() => {
  const q = query(collection($db, "products"), orderBy("createdAt", "desc"));
  onSnapshot(q, (snapshot) => {
    products.value = snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));
  });
});

/* FORM VALIDATION */
const isFormValid = computed(
  () => name.value.trim() !== "" && price.value !== null
);
</script>
