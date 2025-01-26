import axios from "axios";
import { userInstance } from "./apiConfig";

export const apiService = {
  axiosGetProductData : async (path)=>{
    const response = await userInstance.get(path);
    return response;
  },
};

