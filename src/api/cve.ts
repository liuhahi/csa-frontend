import axios from "axios";
import { API_BASE, CONFIG } from "./config";

export const getCVEObjects = (payload) => {
  return axios
    .get(`${API_BASE}/cve-objects/`, CONFIG())
    .then((res) => res.data)
    .catch((e) => {
      console.log(e);
    });
};
