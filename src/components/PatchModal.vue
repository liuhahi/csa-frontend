<template>
  <el-custom-popup
    v-model="props.modelValue"
    :title="`${cveId} - Version ${versionNumber}`"
    width="1440px"
    :destroy-on-close="true"
    @update:model-value="handleUpdate"
    @open="handleOpen"
  >
    <div class="flex flex-col gap-y-2">
      <el-static-card is-border class="">
        <el-txt type="h6">
          By clicking Generate, we will perform the following steps:
        </el-txt>
        <ul class="list-disc pl-5 space-y-2">
          <li
            v-for="(step, index) in steps"
            :key="step.index"
            class="text-gray-700 flex space-x-2 flex-col"
          >
            <div class="flex space-x-2">
              <el-txt>Step {{ index + 1 }}: {{ step.name }}</el-txt>
              <div class="flex items-center">
                <el-icon v-if="step.status == 'loading'" class="is-loading">
                  <Loading />
                </el-icon>
                <el-icon
                  v-else-if="step.status == 'finished'"
                  class="text-emerald-500"
                  ><CircleCheckFilled
                /></el-icon>
                <el-icon v-else-if="step.status == 'error'" class="text-red-600"
                  ><CircleCloseFilled
                /></el-icon>
              </div>
            </div>
            <div v-if="step.status == 'finished'">
              <diff-editor
                v-if="step.template == 'code-diff'"
                :id="`code-trace-diff-editor-${step.id}`"
                :boxHeight="boxHeight"
                :original="step.original"
                :modified="step.modified"
                :language="language"
              />
              <pre
                v-else
              ><code style="white-space: pre-wrap">{{ step.result }}</code></pre>
            </div>
          </li>
        </ul>
      </el-static-card>
      <div class="flex justify-end">
        <el-button
          v-if="generating"
          type="success"
          loading
          disabled
          @click="generate"
          style="width: 120px"
        >
          Generating
        </el-button>
        <el-button v-else type="success" @click="generate" style="width: 120px">
          Generate
        </el-button>
      </div>
    </div>
  </el-custom-popup>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import DiffEditor from "./DiffEditor.vue";
import {
  CircleCheckFilled,
  CircleCloseFilled,
  Loading,
} from "@element-plus/icons-vue";
import {
  extractCodeSnippets,
  extractFunctionName,
  applyPatch,
} from "@/api/cve";

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
const generating = ref(false);
const cveId = defineModel("cveId", { required: true });
const versionNumber = defineModel("versionNumber", { required: true });

interface Step {
  name: string;
  status: string;
  template: string;
  result: string;
  function: Promise<any>;
  original?: string;
  modified?: string;
}

const steps = ref([
  {
    id: 1,
    name: "Extract the diff hunks",
    status: "not-started",
    template: "default",
    result: "",
    function: (payload) => extractCodeSnippets(payload),
    original: "",
    modified: "",
  },
  {
    id: 2,
    name: "Extract the target function name",
    status: "not-started",
    template: "default",
    result: "",
    function: (payload) => extractFunctionName(payload),
  },
  {
    id: 3,
    name: "Apply patch",
    status: "not-started",
    template: "code-diff",
    result: "",
    function: (payload) => applyPatch(payload),
  },
])<Step[]>;

function resetSteps() {
  generating.value = false;
  steps.value = steps.value.map((step) => {
    step.status = "not-started";
    step.result = "";
    return step;
  });
}

const emit = defineEmits(["update:modelValue"]);

function handleUpdate(val: any) {
  emit("update:modelValue", val);
}

function extractWord(inputString) {
  try {
    const regex = /`([^`]+)`/;
    const match = inputString.match(regex);
    return match ? match[1] : inputString;
  } catch (e) {
    return inputString;
  }
}
async function generate() {
  generating.value = true;
  let codeSnippets = "";
  let functionName = "";
  let terminate = false;
  for (let i = 0; i < steps.value.length; i++) {
    if (terminate) {
      break;
    }
    const step = steps.value[i];
    step.status = "loading";
    let payload = {};
    if (step.name === "Extract the diff hunks") {
      payload = {
        cveId: cveId.value,
      };
    } else if (step.name === "Extract the target function name") {
      payload = {
        codeSnippets,
      };
    } else if (step.name === "Apply patch") {
      payload = {
        cveId: cveId.value,
        codeSnippets,
        functionName: extractWord(functionName),
        versionNumber: versionNumber.value,
      };
    }
    console.log("step", step.name, payload);
    step.result = await step.function(payload).then((result) => {
      step.status = "finished";
      if (step.name === "Extract the diff hunks") {
        codeSnippets = encodeURIComponent(JSON.stringify(result)).trim();
      } else if (step.name == "Extract the target function name") {
        if (result && result.includes("I cannot answer")) {
          terminate = true;
          step.status = "error";
          generating.value = false;
        }
        functionName = result;
      } else if (step.name == "Apply patch") {
        step.original = result.original;
        step.modified = result.modified;
      }
      console.log("step", step.name, "finished...");
      return result;
    });
    generating.value = false;
  }
  // extractingCodeSnippets.value = true;
  // const codeSnippets = await extractCodeSnippets({
  //   cveId: cveId.value,
  // })
  //   .then((result) => {
  //     extractCodeSnippetsFinished.value = true;
  //     extractCodeSnippetsResult.value = result;
  //   })
  //   .finally(() => {
  //     extractingCodeSnippets.value = false;
  //   });
}

const handleOpen = () => {
  resetSteps();
};
</script>
<style lang="scss">
.el-custom-popup__header {
  width: auto;
}
</style>
