import apiClient from "./services.js";

export default {
  getAll() {
    return apiClient.get("/building");
  },
  get(id) {
    return apiClient.get(`/building/${id}`);
  },
  create(data) {
    return apiClient.post("/building", data);
  },
  update(id, data) {
    return apiClient.put(`/building/${id}`, data);
  },
  delete(id) {
    return apiClient.delete(`/building/${id}`);
  },
  deleteAll() {
    return apiClient.delete(`/building`);
  },
};
