<template>
  <div class="h-full w-full flex justify-center">
    <div class="w-full">
      <div class="flex flex-col gap-y-4">
        <div class="flex items-start">
          <el-txt type="h6">Summary</el-txt>
        </div>
        <div class="w-full flex flex-col xl:flex-row gap-x-4 gap-y-6">
          <div class="rounded-lg basis-1/2 flex flex-row custom-shadow">
            <div
              class="min-w-max rounded-l-lg flex justify-center green-bg text-white py-4 px-6"
            >
              <div class="flex flex-col justify-center gap-y-1">
                <div>
                  <el-txt type="h4" color="white" class="min-w-max">{{
                    general_lib_ver.total_processed
                  }}</el-txt>
                </div>

                <el-txt type="body1" color="white" class="min-w-max"
                  >Total Library Version</el-txt
                >
              </div>
            </div>
            <div class="rounded-r-lg flex bg-white text-white w-full py-4 px-6">
              <div class="flex flex-wrap items-center gap-x-4 gap-y-2">
                <div class="flex flex-col items-center justify-center">
                  <el-txt type="h6" class="min-w-max">{{
                    general_lib_ver.fixed
                  }}</el-txt>

                  <el-txt type="body1" color="regular" class="min-w-max"
                    >Fixed</el-txt
                  >
                </div>
                <div class="flex items-center align-middle">
                  <el-divider class="divider" direction="vertical" />
                </div>
                <div class="flex flex-col items-center justify-center">
                  <el-txt type="h6" class="min-w-max">{{
                    general_lib_ver.partial_fixed
                  }}</el-txt>

                  <el-txt type="body1" color="regular" class="min-w-max"
                    >Partial Fixed</el-txt
                  >
                </div>
                <div class="flex items-center align-middle">
                  <el-divider class="divider" direction="vertical" />
                </div>
                <div class="flex flex-col items-center justify-center">
                  <el-txt type="h6" class="min-w-max">{{
                    general_lib_ver.failed
                  }}</el-txt>

                  <el-txt type="body1" color="regular" class="min-w-max"
                    >Failed</el-txt
                  >
                </div>
              </div>
            </div>
          </div>

          <div class="rounded-lg basis-1/2 flex flex-row custom-shadow">
            <div
              class="rounded-l-lg flex justify-center danger-bg text-white py-4 px-6"
            >
              <div class="flex flex-col justify-center gap-y-1">
                <el-txt type="h4" color="white" class="min-w-max">{{
                  general_issue.total_processed
                }}</el-txt>

                <el-txt type="body1" color="white" class="min-w-max"
                  >Total Vulnerabilities</el-txt
                >
              </div>
            </div>
            <div class="rounded-r-lg flex bg-white text-white w-full py-4 px-6">
              <div class="flex flex-wrap items-center gap-x-4 gap-y-2">
                <div class="flex flex-col items-center justify-center">
                  <el-txt type="h6" class="min-w-max">{{
                    general_issue.fixed
                  }}</el-txt>

                  <el-txt type="body1" color="regular" class="min-w-max"
                    >Fixed</el-txt
                  >
                </div>
                <div class="flex items-center align-middle">
                  <el-divider class="divider" direction="vertical" />
                </div>
                <div class="flex flex-col items-center justify-center">
                  <el-txt type="h6" class="min-w-max">{{
                    general_issue.partial_fixed
                  }}</el-txt>

                  <el-txt type="body1" color="regular" class="min-w-max"
                    >Partial Fixed</el-txt
                  >
                </div>
                <div class="flex items-center align-middle">
                  <el-divider class="divider" direction="vertical" />
                </div>
                <div class="flex flex-col items-center justify-center">
                  <el-txt type="h6" class="min-w-max">{{
                    general_issue.failed
                  }}</el-txt>

                  <el-txt type="body1" color="regular" class="min-w-max"
                    >Failed</el-txt
                  >
                </div>
                <div class="flex items-center align-middle">
                  <el-divider class="divider" direction="vertical" />
                </div>
                <div class="flex flex-col items-center justify-center">
                  <el-txt type="h6" class="min-w-max">{{
                    general_issue.exploitable
                  }}</el-txt>

                  <el-txt type="body1" color="regular" class="min-w-max"
                    >Exploitable</el-txt
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex items-start mt-14">
        <el-txt type="h6">Patch Results</el-txt>
      </div>
      <div class="mt-4">
        <el-master-table
          ref="tableRef"
          :max-height="1000"
          :data="tableData"
          :columns="columns"
          :pagination-props="paginationProps"
          :has-expand="true"
          :expandFixed="true"
          :row-key="'id'"
          :expandName="'compareComponent'"
        ></el-master-table>
      </div>
    </div>
  </div>
  <!-- <el-master-table
    ref="tableRef"
    :max-height="1000"
    v-loading="loading"
    :data="tableData"
    :columns="columns"
    :table-width="`100%`"
    :row-class-name="tableRowClassName"
    :pagination-props="paginationProps"
    :stripe="true"
    :has-expand="true"
    :expandFixed="true"
    :row-key="'id'"
    :expandName="'compareComponent'"
    class="static m-master_table"
    @queryChange="handleQueryChange"
    @expand-change="handleExpandChange"
  >
  </el-master-table> -->
</template>
<script setup lang="ts">
import { ref } from "vue";
const general_lib_ver = ref<{
  total_processed: number;
  fixed: number;
  partial_fixed: number;
  failed: number;
}>({
  total_processed: 0,
  fixed: 0,
  partial_fixed: 0,
  failed: 0,
});

const general_issue = ref<{
  total_processed: number;
  fixed: number;
  partial_fixed: number;
  failed: number;
  exploitable: number;
}>({
  total_processed: 0,
  fixed: 0,
  partial_fixed: 0,
  failed: 0,
  exploitable: 0,
});

const columns = [
  {
    label: "PROJECT_NAME",
    type: "text",
    prop: "name",
    translate: true,
    align: "left",
    headerAlign: "left",
    minWidth: "99px",
  },
];

const tableData = ref([]);

function init() {
  fetch("output_frontend_summary.json", {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  })
    .then((response) => response.json())
    .then((resJson) => {
      general_lib_ver.value = resJson.general_lib_ver;
      general_issue.value = resJson.general_issue;
    });
  // fetch("output_frontend.json", {
  //   headers: {
  //     "Content-Type": "application/json",
  //     Accept: "application/json",
  //   },
  // })
  //   .then((response) => response.json())
  //   .then((resJson) => {
  //     output_frontend.value = resJson;
  //   });
}

function processSummary(summary) {}

init();
</script>

<style scoped>
.green-bg {
  background-color: var(--el-color-primary-light-3);
}
.danger-bg {
  background-color: var(--el-color-danger-light-3);
}
.divider {
  margin: 12px;
  height: 2em;
}
</style>
