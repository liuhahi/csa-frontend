<template>
  <div class="h-full w-full flex justify-center">
    <div class="w-full">
      <div class="flex flex-col gap-y-4">
        <div class="flex items-start">
          <el-txt type="h6">Summary</el-txt>
        </div>
        <div
          class="rounded-lg px-4 py-2 bg-white border border-solid border-color-light flex items-center gap-x-2"
        >
          <el-txt type="body1" class="regular-txt"> Total </el-txt>
          <el-txt type="h6" class="regular-txt">
            {{ total_lib_ver_analyzed }}
          </el-txt>
          <el-txt type="body1" class="regular-txt"> packages analyzed </el-txt>
        </div>
        <div class="w-full flex flex-col xl:flex-row gap-x-4 gap-y-6">
          <div class="rounded-2xl basis-5/12 flex flex-row custom-shadow">
            <div
              class="min-w-max rounded-l-2xl flex justify-center green-bg text-white py-4 px-6"
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
            <div
              class="rounded-r-2xl flex bg-white text-white w-full py-4 px-6"
            >
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

          <div class="rounded-2xl basis-7/12 flex flex-row custom-shadow">
            <div
              class="min-w-max rounded-l-2xl flex justify-center danger-bg text-white py-4 px-6"
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
            <div
              class="rounded-r-2xl flex bg-white text-white w-full py-4 px-6"
            >
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
                    unique_issue.total_processed
                  }}</el-txt>

                  <el-txt type="body1" color="regular" class="min-w-max"
                    >Exploitability Check</el-txt
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
                style="width: 300px"
                v-model="q.search"
                clearable
                :prefix-icon="Search"
                placeholder="Search library"
                @keyup.stop="handleSearch"
                @clear="fireSearch"
              />
              <el-select
                v-model="q.status"
                clearable
                placeholder="Status"
                @change="(val) => handleChange(val, 'status')"
              >
                <el-option
                  v-for="item in statusList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-select
                v-model="q.exploitable"
                clearable
                placeholder="Exploitability"
                @change="(val) => handleChange(val, 'exploitable')"
              >
                <el-option
                  v-for="item in exploitableList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </template>
            <template #status="{ row }">
              <el-custom-tag :type="getPatchStatusColour(row.status)">
                {{ getPatchStatusName(row.status) }}
              </el-custom-tag>
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
                  <template #status="{ row }">
                    <el-custom-tag :type="getPatchStatusColour(row.status)">
                      {{ getPatchStatusName(row.status) }}
                    </el-custom-tag>
                  </template>

                  <template #exploitability="{ row }">
                    <el-txt type="body2">
                      {{ row.exploitability === false ? "No" : "Yes" }}
                    </el-txt>
                  </template>
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
import {
  getPatchStatusColour,
  getPatchStatusName,
} from "../utils/helperFunctions";

const total_lib_ver_analyzed = ref(0);
const general_lib_ver = ref<{
  total_processed: number;
  fixed: number;
  partial_fixed: number;
  failed: number;
  exploitable: string;
}>({
  total_processed: 0,
  fixed: 0,
  partial_fixed: 0,
  failed: 0,
  exploitable: "",
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

const unique_issue = ref<{
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
const statusList = [
  {
    label: "Fixed",
    value: "fixed",
  },
  {
    label: "Partial Fixed",
    value: "partial_fixed",
  },
  {
    label: "Patching",
    value: "patching",
  },
  {
    label: "Failed",
    value: "failed",
  },
];
const exploitableList = [
  {
    label: "Exploitable",
    value: "Yes",
  },
  {
    label: "Not Exploitable",
    value: "No",
  },
];
const q = reactive({
  page: 1,
  limit: 10,
  status: "",
  search: "",
  exploitable: "",
});

const paginationProps = reactive({
  total: tableData.value.length,
  pageSize: q.limit,
});

const columns = [
  {
    label: "Library",
    type: "Link",
    prop: "library",
    align: "left",
    headerAlign: "left",
    minWidth: "99px",
    fixed: "left",
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
    type: "Link",
    prop: "patch_branch",
    align: "center",
    headerAlign: "center",
    minWidth: "99px",
  },
  {
    label: "Status",
    type: "Any",
    prop: "status",
    align: "center",
    headerAlign: "center",
    minWidth: "99px",
  },
  {
    label: "Fixed / Total",
    type: "text",
    prop: "fixedStatus",
    align: "center",
    headerAlign: "center",
    minWidth: "99px",
  },
  {
    label: "Exploitable",
    type: "text",
    prop: "exploitable",
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
    label: "Patch Status",
    type: "Any",
    prop: "status",
    align: "center",
    headerAlign: "center",
    minWidth: "99px",
  },
  {
    label: "Exploitability",
    type: "Any",
    prop: "exploitability",
    align: "center",
    headerAlign: "center",
    minWidth: "99px",
  },
];

function handleChange(val, key) {
  q[key] = val;
  q.page = 1;
  console.log("what is q", q);
  handleSearch();
}

function handleExpandChange(row, expandedRows) {
  console.log("row", row, expandedRows);
  if (expandedRows.length) {
  }
}

function handleQueryChange(query: any) {
  const { page, limit } = query;
  q.page = page;
  q.limit = limit;
  handleSearch();
  // tableData.value = allData.value.slice((page - 1) * limit, page * limit);
  console.log("limit is", limit, page);
}

function handleSearch() {
  console.log("searching", q);
  let result = allData.value.filter((item) => {
    return item.library_name.toLowerCase().includes(q.search.toLowerCase());
  });
  if (q.status) {
    result = result.filter((item) => item.status === q.status);
  }
  if (q.exploitable) {
    result = result.filter((item) => item.exploitable === q.exploitable);
  }
  paginationProps.total = result.length;
  tableData.value = result.slice((q.page - 1) * q.limit, q.page * q.limit);
}

function fireSearch() {
  q.search = "";
  handleSearch();
}

function formatNumber<T extends Record<string, any>>(obj: T): T {
  const newObj: Partial<T> = {};
  for (const key in obj) {
    if (typeof obj[key] === "number") {
      newObj[key] = obj[key].toLocaleString();
    } else {
      newObj[key] = obj[key];
    }
  }
  return newObj as T;
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
      total_lib_ver_analyzed.value =
        resJson.total_lib_ver_analyzed.toLocaleString();
      general_lib_ver.value = formatNumber(resJson.general_lib_ver);
      general_issue.value = formatNumber(resJson.general_issue);
      unique_issue.value = formatNumber(resJson.unique_issue);
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
        item.exploitable = "No";
        if (item.patch_branch == "") {
          item.patch_branch = {
            label: "-",
            to: "",
          };
        } else {
          item.patch_branch = {
            label: item.patch_branch,
            to: `${item.fork_repo_url}/tree/${item.patch_branch}`,
          };
        }
        item.library = {
          label: item.library_name,
          to: item.fork_repo_url,
        };
        item.repo_url = {
          label: item.repo_url,
          to: item.repo_url,
        };
        item.fixedStatus = `${
          item.security_issues.filter((issue) => issue.status === "fixed")
            .length
        } / ${item.security_issues.length}`;

        item.security_issues = item.security_issues.map((issue) => {
          // if there are any fixed issues considered as fixed
          issue.status = issue.patch_commits.some(
            (issue) => issue.status === "fixed"
          )
            ? "fixed"
            : "failed";
          issue.fixedStatus = `${
            issue.patch_commits.filter((issue) => issue.status === "fixed")
              .length
          } / ${issue.patch_commits.length}`;
          if (issue.exploitability) {
            item.exploitable = "Yes";
          }
          return issue;
        });
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
