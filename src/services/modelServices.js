import apiClient from "./services.js";

export default {
  getAll() {
    return apiClient.get("/model");
  },
  get(id) {
    return apiClient.get(`/model/${id}`);
  },
  create(data) {
    return apiClient.post("/model", data);
  },
  update(id, data) {
    return apiClient.put(`/model/${id}`, data);
  },
  delete(id) {
    return apiClient.delete(`/model/${id}`);
  },
  deleteAll() {
    return apiClient.delete(`/model`);
  },
};
