import apiClient from "./services.js";

export default {
  getAll() {
    return apiClient.get("/room");
  },
  getAllForBuilding(buildingId) {
    return apiClient.get(`/room/building/${buildingId}`);
  },
  get(id) {
    return apiClient.get(`/room/${id}`);
  },
  create(data) {
    return apiClient.post("/room", data);
  },
  update(id, data) {
    return apiClient.put(`/room/${id}`, data);
  },
  delete(id) {
    return apiClient.delete(`/room/${id}`);
  },
  deleteAll() {
    return apiClient.delete(`/room`);
  },
};
