<template>
  <div class="flex flex-col gap-3">
    <div 
      ref="divRef" 
      class="h-96 border-2 border-gray-700 rounded-xl bg-gray-900 transition-all focus-within:border-purple-500 focus-within:ring-4 focus-within:ring-purple-500/20"
    ></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue"
import { AiEditor } from "aieditor"
import "aieditor/dist/style.css"
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const divRef = ref(null)
let aiEditor = null

onMounted(() => {
  if (!divRef.value) return

  aiEditor = new AiEditor({
    element: divRef.value,
    lang: "fr",
    content: props.modelValue || "",
    placeholder: "Écrivez votre texte...",
    onChange: (editor) => {
      const content = editor.getHtml()
      emit('update:modelValue', content)
    }
  })
})

watch(() => props.modelValue, (newValue) => {
  if (aiEditor && aiEditor.getHtml() !== newValue) {
    aiEditor.setContent(newValue || "")
  }
})

onUnmounted(() => {
  if (aiEditor) {
    aiEditor.destroy()
    aiEditor = null
  }
})
</script>