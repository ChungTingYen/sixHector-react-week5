/* eslint-disable react/prop-types */
import { useForm } from "react-hook-form";
import { apiService } from "../apiService/apiService";
const APIPath = import.meta.env.VITE_API_PATH;

const CustomerInfo = (props)=>{
  const { setIsLoading,setReload } = props;
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  
  const onSubmit = handleSubmit((data) => {
    const { message, ...user } = data;
    const userInfo = {
      data: {
        user,
        message,
      },
    };
    checkOrder(userInfo);
  });
  const checkOrder = async (userInfo) => {
    setIsLoading(true);
    try {
      const {
        data: { total, orderId, success, message },
      } = await apiService.axiosPost(`/api/${APIPath}/order`, userInfo);
      setReload(true);
      reset();
    } catch (error) {
      console.log(error);
      alert(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="my-5 row justify-content-center">
      <form className="col-md-6" onSubmit={onSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            id="email"
            type="email"
            className={`form-control ${errors.email && "is-invalid"}`}
            placeholder="請輸入 Email"
            {...register("email", {
              required: "Email欄位必填",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "email 格式錯誤",
              },
            })}
          />
          {errors.email && (
            <p className="text-danger my-2">{errors.email.message}</p>
          )}
        </div>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            收件人姓名
          </label>
          <input
            id="name"
            className={`form-control ${errors.name && "is-invalid"}`}
            placeholder="請輸入姓名"
            {...register("name", {
              required: "姓名為必填",
            })}
          />
          {errors.name && (
            <p className="text-danger my-2">{errors.name.message}</p>
          )}
        </div>
        <div className="mb-3">
          <label htmlFor="tel" className="form-label">
            收件人電話
          </label>
          <input
            id="tel"
            type="text"
            className={`form-control ${errors.tel && "is-invalid"}`}
            placeholder="請輸入電話"
            {...register("tel", {
              required: "電話欄位為必填",
              pattern: {
                value: /^(0[2-8]\d{7}|09\d{8})$/,
                message: "電話格式錯誤",
              },
            })}
          />
          {errors.tel && (
            <p className="text-danger my-2">{errors.tel.message}</p>
          )}
        </div>
        <div className="mb-3">
          <label htmlFor="address" className="form-label">
            收件人地址
          </label>
          <input
            id="address"
            type="text"
            className={`form-control ${errors.address && "is-invalid"}`}
            placeholder="請輸入地址"
            {...register("address", {
              required: "地址欄位為必填",
              minLength: {
                value: 6,
                message: "地址至少需要輸入6個字",
              },
            })}
          />
          {errors.address && (
            <p className="text-danger my-2">{errors.address.message}</p>
          )}
        </div>
        <div className="mb-3">
          <label htmlFor="message" className="form-label">
            留言
          </label>
          <textarea
            id="message"
            className="form-control"
            cols="30"
            rows="10"
            {...register("message")}
          ></textarea>
        </div>
        <div className="text-end">
          <button type="submit" className="btn btn-danger">
            送出訂單
          </button>
        </div>
      </form>
    </div>
  );
};
export default CustomerInfo;