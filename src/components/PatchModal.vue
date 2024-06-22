<template>
  <el-custom-popup
    v-model="props.modelValue"
    title="AI Patch"
    width="1440px"
    :destroy-on-close="true"
    @update:model-value="handleUpdate"
    @open="handleOpen"
  >
    <div class="flex flex-col gap-y-2">
      <el-txt
        >By clicking <b>Generate</b> Here are the steps we are doing</el-txt
      >
      <ul class="list-disc">
        <li>Extracting diff hunks</li>
        <li>Extracting target function name</li>
        <li>Applying patch</li>
      </ul>
      <el-button type="success" style="width: 120px"> Generate </el-button>
    </div>
    <diff-editor
      v-if="fileGenerated"
      id="code-trace-diff-editor"
      :boxHeight="boxHeight"
      :original="originalFile"
      :modified="modifiedFile"
      :language="language"
    />
  </el-custom-popup>
</template>
<script lang="ts" setup>
import DiffEditor from "./DiffEditor.vue";
import { ref } from "vue";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});

const boxHeight = "600px";
const originalFile = ref("");
const modifiedFile = ref("");
const language = "c";

const fileGenerated = ref(false);

const emit = defineEmits(["update:modelValue"]);

function handleUpdate(val: any) {
  emit("update:modelValue", val);
}

const handleOpen = () => {};
</script>
<style lang="scss" scoped>
.m-code_trace_popup {
  max-height: calc(100vh - var(--el-custom-popup-margin-top, 15vh) * 2);
  display: flex;
  flex-direction: column;
  .el-scrollbar {
    flex: 1;
    display: flex;
    flex-direction: column;
    .el-scrollbar__wrap {
      flex: 1;
    }
  }
  .el-expandable-card__body {
    padding: 0;
  }
}
</style>
<style lang="scss">
.el-custom-popup__header {
  width: auto;
}
</style>
