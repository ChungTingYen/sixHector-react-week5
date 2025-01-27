import axios from "axios";

const userBaseUrl = `${import.meta.env.VITE_BASE_URL}/v2`;

export const userInstance =  axios.create({ baseURL:userBaseUrl });

userInstance.interceptors.request.use((config)=>{
  return config;
});

userInstance.interceptors.response.use(
  (response)=>response,
  (error)=>{
    const errors = 
    error.response?.data.message 
      ? `狀態: ${error.status}, ${error.response.data.message}` 
      : error;
    //
    // alert(errors);
    return Promise.reject(errors);
  }
);