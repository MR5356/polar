<script lang="ts" setup>
import { ref } from 'vue'
import CodeEditor from "@/components/CodeEditor.vue"

const v = ref("package main")

</script>

<template>
    <div class="w-full h-full">
    <CodeEditor language="go" :read-only="false" v-model:value="v" />
    </div>
</template>