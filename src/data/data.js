export const tempProductDefaultValue = {
  imageUrl: "",
  title: "",
  category: "",
  unit: "",
  origin_price: 0,
  price: 0,
  description: "",
  content: "",
  is_enabled: false,
  imagesUrl: [""],
};

export const registerRules = {
  email:{
    required: "Email欄位必填",
    pattern: {
      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      message: "email 格式錯誤",
    } 
  },
  name:{
    required: "姓名為必填",
  },
  tel:{
    required: "電話欄位為必填",
    pattern: {
      value: /^(0[2-8]\d{7,8}|09\d{8})$/,
      message: "電話格式錯誤",
    },
  },
  address:{
    required: "地址欄位為必填",
    minLength: {
      value: 6,
      message: "地址至少需要輸入6個字",
    },
  }
};