import apiClient from "./services";
// const { authenticate } = require("../authorization/authorization.js");

export default {
    //get all fields
    getAll(){
        return apiClient.get("/field");
    },
    getAllForId(id){
        return apiClient.get(`/field/${id}`);
    },
    create(data){
        return apiClient.post("/field", data);
    },
    update(id, data){
        return apiClient.put(`/field/${id}`, data);
    },
    delete(id){
        return apiClient.delete(`/field/${id}`);
    },
    deleteAll(){
        return apiClient.delete("/field");
    }
};