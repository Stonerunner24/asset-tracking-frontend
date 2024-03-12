import apiClient from "./services.js";

export default {
  getAll() {
    return apiClient.get("/assignment");
  },
  getAllForBuilding(buildingId) {
    return apiClient.get(`/assignment/building/${buildingId}`);
  },
  get(id) {
    return apiClient.get(`/assigment/${id}`);
  },
  create(data) {
    return apiClient.post("/assignment", data);
  },
  update(id, data) {
    return apiClient.put(`/assignment/${id}`, data);
  },
  delete(id) {
    return apiClient.delete(`/assignment/${id}`);
  },
  deleteAll() {
    return apiClient.delete(`/assignment`);
  },
};
