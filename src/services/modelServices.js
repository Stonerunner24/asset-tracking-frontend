import apiClient from "./services.js";

export default {
  getAll() {
    return apiClient.get("/model/");
  },
  get(id) {
    return apiClient.get(`/model/${id}`);
  },
  getAllByType(typeId){
    return apiClient.get(`/model/type/${typeId}`);
  },
  getAllFields(modelId){
    return apiClient.get(`/model/${modelId}/field`);
  },
  bulkCreateFields(modelId, data){
    return apiClient.post(`/model/${modelId}/field`, data);
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