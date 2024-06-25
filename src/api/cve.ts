import axios from "axios";
import { ElMessage } from "element-plus";
import { API_BASE, CONFIG } from "./config";

function errorHandler(error) {
  // default redirect == true for 404
  try {
    const { data, status } = error.response;
    ElMessage({
      showClose: true,
      message: status,
      type: "error",
    });
  } catch (e) {}
}

export const getCVEObjects = (payload) => {
  return axios
    .get(`${API_BASE}/cve-objects/`, CONFIG())
    .then((res) => res.data)
    .catch((e) => errorHandler(e));
};

export const extractCodeSnippets = (payload) => {
  return axios
    .get(`${API_BASE}/extract-code-snippets/?cve_id=${payload.cveId}`, CONFIG())
    .then((res) => res.data)
    .catch((e) => errorHandler(e));
};

export const extractFunctionName = (payload) => {
  return axios
    .get(`${API_BASE}/extract-function-name/?code-snippets=${payload.codeSnippets}`, CONFIG())
    .then((res) => res.data)
    .catch((e) => errorHandler(e));
}

export const applyPatch = (payload) => {
  return axios
    .get(`${API_BASE}/apply-patch/?cve=${payload.cveId}&version-number=${payload.versionNumber}&code-snippets=${payload.codeSnippets}&function-name=${payload.functionName}`, CONFIG())
    .then((res) => res.data)
    .catch((e) => errorHandler(e));
}
