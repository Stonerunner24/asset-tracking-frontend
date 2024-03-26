import apiClient from "./services.js";
var baseURL = "/item/";

export default {
    getAll(){
        return apiClient.get(baseURL);
    },
    getAllForModel(modelId){
        return apiClient.get(baseURL + `model/${modelId}`);
    },
    getAllForManyCategories(categoryIds) {
        const categoryIdsString = categoryIds.join(',');
        return apiClient.get(baseURL + `categories/${categoryIdsString}`);
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
    },
    //ITEM INFORMATION SERVICES
    getAllInfo(){
        return apiClient.get(baseURL + `info`);
    },
    getAllInfoForItem(itemId){
        return apiClient.get(baseURL + `info/item/${itemId}`);
    },
    createInfo(data){
        return apiClient.post(baseURL + `info`, data);
    }
};