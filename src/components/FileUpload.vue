<template>
  <el-custom-popup
    v-model="props.modelValue"
    :title="`Upload file to ${cveId}/${versionNumber}`"
    width="640px"
    :destroy-on-close="true"
    @update:model-value="handleUpdate"
    @open="handleOpen"
  >
    <div class="flex flex-col space-y-4">
      <el-txt type="body1">Select a destination</el-txt>
      <el-radio-group v-model="subFolder">
        <el-radio :value="versionNumber" size="small">
          <el-txt type="body2">{{ versionNumber }}</el-txt></el-radio
        >
        <el-radio value="patch-files" size="small"
          ><el-txt type="body2">Patch File</el-txt></el-radio
        >
      </el-radio-group>
      <el-upload
        class="upload-demo"
        drag
        :data="{ 'cve-id': cveId, subfolder: subFolder }"
        :action="`${API_BASE}/upload_target_file/`"
        multiple
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
          Drop file here or <em>click to upload</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            Target files with a size less than 1MB
          </div>
        </template>
      </el-upload>
    </div>
  </el-custom-popup>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { API_BASE } from "@/api/config";
const cveId = defineModel("cveId", { required: true });
const versionNumber = defineModel("versionNumber", { required: true });
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});
const subFolder = ref("patch-files");

function handleUpdate() {}

function handleOpen() {}
</script>
