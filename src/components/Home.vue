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
        <el-static-card>
          <el-master-table
            ref="tableRef"
            :max-height="1000"
            :data="tableData"
            :columns="columns"
            :pagination-props="paginationProps"
            :has-expand="true"
            :expandFixed="true"
            :row-key="'id'"
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

function handleExpandChange() {}

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
