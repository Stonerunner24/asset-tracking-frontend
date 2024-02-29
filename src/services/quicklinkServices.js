import apiClient from "./services.js";

const QuickLinkService = {
  getAll() {
    return apiClient.get("/quicklink");
  },  
  getByUserId: function(userId) {
    return apiClient.get(`/quicklink/?userId=${userId}`);
  },
  get(id) {
    return apiClient.get(`/quicklink/${id}`);
  },
  create(data) {
    return apiClient.post("/quicklink", data);
  },
  update(id, data) {
    return apiClient.put(`/quicklink/${id}`, data);
  },
  delete(id) {
    return apiClient.delete(`/quicklink/${id}`);
  },
  deleteAll() {
    return apiClient.delete(`/quicklink`);
  }
};

export default QuickLinkService;
