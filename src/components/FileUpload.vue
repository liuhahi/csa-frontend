<template>
  <el-custom-popup
    v-model="props.modelValue"
    :title="`Upload file to ${cveId}/${versionNumber}`"
    width="640px"
    :destroy-on-close="true"
    @close="handleClose"
    @update:model-value="handleUpdate"
    @open="handleOpen"
  >
    <el-card shadow="never">
      <template #header>Current folder</template>
      <div v-for="link in currentPatches" :key="link" class="mb-2">
        <div class="flex flex-row gap-x-2 items-center">
          <el-icon><Document /></el-icon>
          <el-link :href="`${repoUrl}/commit/${link}`" target="_blank">{{
            `${repoUrl}/commit/${link}`
          }}</el-link>
        </div>
      </div>
    </el-card>
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <div class="flex flex-col gap-y-4">
        <el-tab-pane label="URL" name="url">
          <el-form ref="formRef" :model="dynamicValidateForm">
            <div class="my-4">
              <el-txt type="body"
                >Please copy and past the github commit url here</el-txt
              >
            </div>

            <el-form-item
              v-for="(patch, index) in dynamicValidateForm.patches"
              :key="patch.key"
              :label="`Patch ${index}`"
              :prop="'patches.' + index + '.value'"
              :rules="[
                {
                  required: true,
                  message: 'Please input patch link address',
                  trigger: 'blur',
                },
              ]"
            >
              <div class="flex flex-row gap-x-4 items-center">
                <el-input
                  size="small"
                  class="w-120 h-6"
                  v-model="patch.value"
                />
                <el-button
                  v-if="index > 0"
                  type="danger"
                  size="small"
                  :icon="Delete"
                  @click.prevent="removePatch(patch)"
                >
                </el-button>
              </div>
            </el-form-item>
            <el-form-item>
              <div class="w-full">
                <div class="flex justify-end space-x-4">
                  <el-button @click="addPatch" type="success">New</el-button>
                  <el-button v-if="submitting == true" :loading="true" disabled>
                    Submitting
                  </el-button>
                  <el-button v-else type="primary" @click="submitForm(formRef)"
                    >Submit</el-button
                  >
                </div>
              </div>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="Upload" name="upload">
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
              :action="`${API_BASE}/upload-target-file/`"
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
        </el-tab-pane>
      </div>
    </el-tabs>
  </el-custom-popup>
</template>
<script lang="ts" setup>
import { reactive, ref } from "vue";
import { API_BASE } from "@/api/config";
import { submitPatchLinks, getPatchLinks, deletePatchLink } from "@/api/cve";
import { Delete, Document } from "@element-plus/icons-vue";
import type { FormInstance } from "element-plus";

const formRef = ref<FormInstance>();
const dynamicValidateForm = reactive<{
  patches: PatchItem[];
  email: string;
}>({
  patches: [
    {
      key: 1,
      value: "",
    },
  ],
  email: "",
});
const cveId = defineModel("cveId", { required: true });
const emit = defineEmits(["update:modelValue"]);
const versionNumber = defineModel("versionNumber", { required: true });
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  repoUrl: {
    type: String,
    default: "",
  },
});
const subFolder = ref(versionNumber.value);
const currentPatches = ref<string[]>([]);

const activeName = ref("url");
function handleClick(tab, event) {
  console.log(tab, event);
}

interface PatchItem {
  key: number;
  value: string;
}

const removePatch = (item: PatchItem) => {
  const index = dynamicValidateForm.patches.indexOf(item);
  if (index !== -1) {
    dynamicValidateForm.patches.splice(index, 1);
  }
};

const addPatch = () => {
  dynamicValidateForm.patches.push({
    key: Date.now(),
    value: "",
  });
};

const submitting = ref(false);
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate((valid) => {
    console.log("valid", valid);
    if (valid) {
      console.log("submit!", dynamicValidateForm.patches);
      submitting.value = true;
      submitPatchLinks({
        patches: dynamicValidateForm.patches.map((patch) => patch.value),
        "cve-id": cveId.value,
        subfolder: "patch-files",
      }).then(() => {
        submitting.value = false;
        init();
      });
    } else {
      console.log("error submit!");
    }
  });
};

function init() {
  console.log("run init");
  dynamicValidateForm.patches = [
    {
      key: 1,
      value: "",
    },
  ];
  getPatchLinks({ cveId: cveId.value }).then((res) => {
    console.log("what is res", res);
    currentPatches.value = res.map((item) => item.split("/").pop());
  });
}

function handleUpdate() {}

function handleOpen() {
  init();
}

function handleClose() {
  emit("update:modelValue", false);
}
</script>
<style>
.demo-tabs > .el-tabs__content {
  padding: 0px;
}
</style>
