import apiClient from "./services.js";

export default {
  getAll() {
    return apiClient.get("/category");
  },
  get(id) {
    return apiClient.get(`/category/${id}`);
  },
  getAllForUser(userId) {
    return apiClient.get(`/category/user/${userId}`);
  },
  getAllIdsForUser(userId) {
    return apiClient.get(`/category/user/${userId}/ids`);
  },
  create(data) {
    return apiClient.post("/category", data);
  },
  update(id, data) {
    return apiClient.put(`/category/${id}`, data);
  },
  delete(id) {
    return apiClient.delete(`/category/${id}`);
  },
  deleteAll() {
    return apiClient.delete(`/category`);
  },
  findByTitle(title) {
    return apiClient.get(`/category?catName=${catName}`);
  },
};
