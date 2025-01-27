
import { userInstance } from "./apiConfig";

export const apiService = {
  axiosGet : async (path)=>{
    const response = await userInstance.get(path);
    return response;
  },
  axiosPost:async(path,postData)=>{
    const response = await userInstance.post(path,postData);
    return response;
  },
  // axiosGetCartData:async(path)=>{
  //   const response = await userInstance.get(path);
  //   return response;
  // },
  axiosDelete:async(path)=>{
    const response = await userInstance.delete(path);
    response;
  },
  axiosPut:async(path,putData)=>{
    const response = await userInstance.put(path,putData);
    return response;
  }
  // axiosDelete:async(path)=>{
  //   const response = await userInstance.delete(path);
  //   response;
  // }
};

