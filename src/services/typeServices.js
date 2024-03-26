import apiClient from "./services.js";

export default {
  getAll() {
    return apiClient.get("/type");
  },
  getAllForCategory(categoryId) {
    return apiClient.get(`/type/category/${categoryId}`);
  },
  getAllForManyCategories(categoryIds){
    const categoryIdsString = categoryIds.join(',');
    return apiClient.get(`/type/categories/${categoryIdsString}`);
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

  getAllFields(id){
    return apiClient.get(`/type/${id}/typefield`);
  },
  getAllTypeFields(id){
    return apiClient.get(`/type/${id}/typefield`);
  },
  createTypeFields(id, data){
    return apiClient.post(`/type/${id}/typefield`, data);
  },
  getAllItemFields(id){
    return apiClient.get(`/type/${id}/typefield/item`);
  },
  getAllModelFields(id){
    return apiClient.get(`/type/${id}/typefield/model`);

  }

};
