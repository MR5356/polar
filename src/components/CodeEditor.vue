<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as monaco from 'monaco-editor'

const editorRef = ref(null)
let editor: monaco.editor.IStandaloneCodeEditor

const props = defineProps({
  value: {
    type: String,
    default: ''
  },
  language: {
    type: String,
    default: 'shell'
  },
  readOnly: {
    type: Boolean,
    default: false
  },
  theme: {
    type: String,
    default: 'vs-dark'
  }
})

const emit = defineEmits<(e: 'update:value', value: string) => void>()
onMounted(() => {
  editor = monaco.editor.create(editorRef.value, {
    value: props.value,
    language: props.language,
    minimap: {
      enabled: false
    },
    colorDecorators: true,
    readOnly: props.readOnly,
    theme: props.theme,
    acceptSuggestionOnCommitCharacter: true,
    acceptSuggestionOnEnter: 'on',
    codeLens: true,
    columnSelection: true,
    folding: true,  // 是否启用代码折叠
    links: true,  // 是否点击链接
    scrollBeyondLastLine: true,  // 设置编辑器是否可以滚动到最后一行之后
  })

  editor.onDidChangeModelContent(() => {
    const value = editor.getValue()
    emit('update:value', value)
  })
})

onBeforeUnmount(() => {
    if (editor) {
        editor.dispose()
    }
})
</script>

<template>
  <div ref="editorRef" id="editor" class="w-full h-full"></div>
</template>
