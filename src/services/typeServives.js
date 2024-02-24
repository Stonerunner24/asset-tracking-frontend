import apiClient from "./services.js";

export default {
  getAll() {
    return apiClient.get("/types");
  },
  getAllForCategory(categoryId) {
    return apiClient.get("/types/" + categoryId);
  },
  get(id) {
    return apiClient.get(`/types/${id}`);
  },
  create(data) {
    return apiClient.post("/types", data);
  },
  update(id, data) {
    return apiClient.put(`/types/${id}`, data);
  },
  delete(id) {
    return apiClient.delete(`/types/${id}`);
  },
  deleteAll() {
    return apiClient.delete(`/types`);
  },
};
