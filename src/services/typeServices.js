import apiClient from "./services.js";

export default {
  getAll() {
    return apiClient.get("/type");
  },
  getAllForCategory(categoryId) {
    return apiClient.get("/type/category/" + categoryId);
  },
  get(id) {
    return apiClient.get(`/type/${id}`);
  },
  create(data) {
    return apiClient.post("/type", data);
  },
  update(id, data) {
    return apiClient.put(`/type/${id}`, data);
  },
  delete(id) {
    return apiClient.delete(`/type/${id}`);
  },
  deleteAll() {
    return apiClient.delete(`/type`);
  },
};