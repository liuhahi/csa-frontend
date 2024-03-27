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
        <el-static-card>
          <el-master-table
            ref="tableRef"
            :max-height="1000"
            :data="tableData"
            :columns="columns"
            :pagination-props="paginationProps"
            :has-expand="true"
            :expandFixed="true"
            :row-key="'library_version_id'"
            v-loading="loading"
            :expandName="'security-section'"
            @queryChange="handleQueryChange"
            @expand-change="handleExpandChange"
          >
            <template #top-left>
              <el-input
                style="width: 1144px"
                v-model="q.search"
                clearable
                :prefix-icon="Search"
                placeholder="Search library"
                @keyup.stop="handleSearch"
                @clear="fireSearch"
              />
            </template>
            <template #security-section="{ props }">
              <div class="py-6 px-3">
                <el-txt type="subtitle1">Security Issues</el-txt>
                <el-master-table
                  :table-width="'700px'"
                  :has-pagination="false"
                  :size="'small'"
                  :data="props.row.security_issues"
                  :columns="securityColumns"
                >
                </el-master-table>
              </div>
            </template>
          </el-master-table>
        </el-static-card>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue";
import { Search } from "@element-plus/icons-vue";
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

const allData = ref([]);
const tableData = ref([]);
const loading = ref(false);
const q = reactive({
  page: 1,
  limit: 10,
  search: "",
});

const paginationProps = reactive({
  total: tableData.value.length,
  pageSize: q.limit,
});

const columns = [
  {
    label: "Library",
    type: "text",
    prop: "library_name",
    align: "left",
    headerAlign: "left",
    minWidth: "99px",
  },
  {
    label: "Version",
    type: "text",
    prop: "version_number",
    align: "center",
    headerAlign: "center",
    minWidth: "99px",
  },
  {
    label: "Patch Branch",
    type: "text",
    prop: "patch_branch",
    align: "center",
    headerAlign: "center",
    minWidth: "99px",
  },
  {
    label: "Status",
    type: "text",
    prop: "status",
    align: "center",
    headerAlign: "center",
    minWidth: "99px",
  },
  {
    label: "Repo Url",
    type: "Link",
    prop: "repo_url",
    align: "center",
    headerAlign: "center",
    minWidth: "99px",
  },
];

const securityColumns = [
  {
    label: "Public ID",
    type: "text",
    prop: "public_id",
    align: "center",
    headerAlign: "center",
    minWidth: "99px",
  },
  {
    label: "Status",
    type: "text",
    prop: "status",
    align: "center",
    headerAlign: "center",
    minWidth: "99px",
  },
  {
    label: "Exploitable",
    type: "text",
    prop: "exploitability",
    align: "center",
    headerAlign: "center",
    minWidth: "99px",
  },
];

function handleExpandChange(row, expandedRows) {
  console.log("row", row, expandedRows);
  if (expandedRows.length) {
  }
}

function handleQueryChange(query: any) {
  const { page, limit } = query;
  q.page = page;
  q.limit = limit;
  tableData.value = allData.value.slice((page - 1) * limit, page * limit);
  console.log("limit is", limit, page);
}

function handleSearch() {
  console.log("searching", q);
  const result = allData.value.filter((item) => {
    return item.library_name.toLowerCase().includes(q.search.toLowerCase());
  });
  paginationProps.total = result.length;
  console.log("result", result.length);
  tableData.value = result.slice((q.page - 1) * q.limit, q.page * q.limit);
}

function fireSearch() {
  q.search = "";
  handleSearch();
}

function init() {
  loading.value = true;
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
  fetch("output_frontend.json", {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  })
    .then((response) => response.json())
    .then((resJson) => {
      loading.value = false;
      allData.value = resJson.map((item) => {
        if (item.patch_branch == "") {
          item.patch_branch = "-";
        }
        item.repo_url = {
          label: item.repo_url,
          to: item.repo_url,
        };
        return item;
      });
      paginationProps.total = allData.value.length;
      tableData.value = allData.value.slice(0, q.limit);
    });
}

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
