import apiClient from "./services.js";
var baseURL = "/item/";

export default {
    getAll(){
        return apiClient.get(baseURL);
    },
    getOne(itemId){
        return apiClient.get(baseURL + itemId);
    },
    create(data){
        return apiClient.post(baseURL, data);
    },
    update(itemId, data){
        return apiClient.put(baseURL + itemId, data);
    },
    delete(itemId){
        return apiClient.delete(baseURL + itemId);
    }
};