<template>
  <div class="h-full flex justify-center">
    <div class="">
      <div class="flex items-start">
        <el-txt type="h6">Summary</el-txt>
      </div>
      <div class="flex space-x-4">
        <div>
          <div class="flex flex-row mt-4 shadow-lg">
            <div
              class="rounded-l-lg flex justify-center green-bg text-white h-18 py-4 px-6"
            >
              <div class="flex flex-col">
                <div>
                  <el-txt type="h4" color="white">{{
                    general_lib_ver.total_processed
                  }}</el-txt>
                </div>
                <div class="mt-2">
                  <el-txt type="body1" color="white"
                    >Total Library Version</el-txt
                  >
                </div>
              </div>
            </div>
            <div
              class="rounded-r-lg flex justify-center bg-white text-white h-18 py-4 px-6"
            >
              <div class="flex items-center">
                <div class="flex flex-col items-center justify-center">
                  <div>
                    <el-txt type="h6">{{ general_lib_ver.fixed }}</el-txt>
                  </div>
                  <div><el-txt type="body1" color="regular">Fixed</el-txt></div>
                </div>
                <div class="flex items-center align-middle">
                  <el-divider class="divider" direction="vertical" />
                </div>
                <div class="flex flex-col items-center justify-center">
                  <div>
                    <el-txt type="h6">{{
                      general_lib_ver.partial_fixed
                    }}</el-txt>
                  </div>
                  <div>
                    <el-txt type="body1" color="regular">Partial Fixed</el-txt>
                  </div>
                </div>
                <div class="flex items-center align-middle">
                  <el-divider class="divider" direction="vertical" />
                </div>
                <div class="flex flex-col items-center justify-center">
                  <div>
                    <el-txt type="h6">{{ general_lib_ver.failed }}</el-txt>
                  </div>
                  <div>
                    <el-txt type="body1" color="regular">Failed</el-txt>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div class="flex flex-row mt-4 shadow-lg">
            <div
              class="rounded-l-lg flex justify-center danger-bg text-white h-18 py-4 px-6 w-36"
            >
              <div class="flex flex-col">
                <div>
                  <el-txt type="h4" color="white">{{
                    general_issue.total_processed
                  }}</el-txt>
                </div>
                <div class="mt-2">
                  <el-txt type="body1" color="white"
                    >Total Vulnerabilities</el-txt
                  >
                </div>
              </div>
            </div>
            <div
              class="rounded-r-lg flex justify-center bg-white text-white h-18 py-4 px-6"
            >
              <div class="flex items-center">
                <div class="flex flex-col items-center justify-center">
                  <div>
                    <el-txt type="h6">{{ general_issue.fixed }}</el-txt>
                  </div>
                  <div><el-txt type="body1" color="regular">Fixed</el-txt></div>
                </div>
                <div class="flex items-center align-middle">
                  <el-divider class="divider" direction="vertical" />
                </div>
                <div class="flex flex-col items-center justify-center">
                  <div>
                    <el-txt type="h6">{{ general_issue.partial_fixed }}</el-txt>
                  </div>
                  <div>
                    <el-txt type="body1" color="regular">Partial Fixed</el-txt>
                  </div>
                </div>
                <div class="flex items-center align-middle">
                  <el-divider class="divider" direction="vertical" />
                </div>
                <div class="flex flex-col items-center justify-center">
                  <div>
                    <el-txt type="h6">{{ general_issue.failed }}</el-txt>
                  </div>
                  <div>
                    <el-txt type="body1" color="regular">Failed</el-txt>
                  </div>
                </div>
                <div class="flex items-center align-middle">
                  <el-divider class="divider" direction="vertical" />
                </div>
                <div class="flex flex-col items-center justify-center">
                  <div>
                    <el-txt type="h6">{{ general_issue.exploitable }}</el-txt>
                  </div>
                  <div>
                    <el-txt type="body1" color="regular">Exploitable</el-txt>
                  </div>
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
