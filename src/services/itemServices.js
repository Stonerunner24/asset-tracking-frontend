import apiClient from "./services.js";
var baseURL = "/item/";

export default {
    getAll(){
        return apiClient.get(baseURL);
    },
    getAllForModel(modelId){
        return apiClient.get(baseURL + `model/${modelId}`);
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
        return apiClient.get(baseURL + `${itemId}/info`);
    },
    createInfo(data){
        return apiClient.post(baseURL + `info`, data);
    },
    //ITEM FIELD SERVICES
    createField(itemId, data){
        return apiClient.post(baseURL + `${itemId}/fields/`, data);
    },
    getAllFieldsForItem(itemId){
        return apiClient.get(baseURL + `${itemId}/fields/`)
    },
    bulkCreateFields(itemId, data){
        return apiClient.post(baseURL + `${itemId}/fields/bulkCreate/`, data);
    },
    deleteField(itemId, fieldId){
        return apiClient.delete(baseURL + `${itemId}/fields/${fieldId}`);
    }
};