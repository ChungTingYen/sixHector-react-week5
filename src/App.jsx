import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import ReactLoading from "react-loading";
import { apiService } from "./apiService/apiService";
// import { Modal } from "bootstrap";
import { tempProductDefaultValue } from "./data/data";
import { Product, ProductModal } from "./component";
const APIPath = import.meta.env.VITE_API_PATH;
function App() {
  const [products, setProducts] = useState([]);
  const [tempProduct, setTempProduct] = useState(tempProductDefaultValue);
  const [cart, setCart] = useState({});
  const [reload, setReload] = useState(true);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // const [productDetail, setProductDetail] = useState(null);

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
  const handleSeeMore = (productId) => {
    const temp = products.find((item) => item.id === productId);
    setTempProduct(temp);
    openProductDetailModal();
  };
  const handleDeleteCart = async (cartId = null) => {
    //如果有cardId就是刪除一個，沒有就是刪除全部
    const path = `api/${APIPath}/cart` + (cartId ? `/${cartId}` : "s");
    setIsLoading(true);
    try {
      await apiService.axiosDelete(path);
      setReload(true);
    } catch (error) {
      console.log(error);
      alert(error);
    } finally {
      setIsLoading(false);
    }
  };
  const getCart = async () => {
    try {
      const {
        data: { data, success, message },
      } = await apiService.axiosGet(`/api/${APIPath}/cart`);
      // console.log(data);
      setCart(data);
    } catch (error) {
      console.log(error);
    }
  };
  const getProducts = async () => {
    setIsLoading(true);
    try {
      const {
        data: { products, pagination, success, message },
      } = await apiService.axiosGet(`/api/${APIPath}/products`);
      setProducts(products);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const openProductDetailModal = () => {
    setIsProductModalOpen(true);
  };
  const handleIncreDecreProduct = async (cartId, type) => {
    setIsLoading(true);
    try {
      const tempCart = { ...cart };
      const { product, qty } = tempCart.carts.find(
        (cart) => cart.id === cartId
      );
      const putData = {
        data: {
          product_id: product.id,
          qty: type === "+" ? qty + 1 : qty - 1,
        },
      };
      await apiService.axiosPut(`/api/${APIPath}/cart/${cartId}`, putData);
      setReload(true);
    } catch (error) {
      console.log(error);
      alert(error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (reload) {
      getProducts();
      getCart();
      setReload(false);
    }
  }, [reload]);
  // useEffect(() => {
  //   console.log("isLoading:", isLoading);
  // }, [isLoading]);
  return (
    <>
      <div className="container">
        <div className="mt-4">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>圖片</th>
                <th>商品名稱</th>
                <th>價格</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <Product
                  key={product.id}
                  handleSeeMore={handleSeeMore}
                  product={product}
                  setReload={setReload}
                  setIsLoading={setIsLoading}
                ></Product>
              ))}
            </tbody>
          </table>
          <table className="table align-middle">
            <thead>
              <tr>
                <th>刪除</th>
                <th style={{ width: "30%" }}>品名</th>
                <th>圖片</th>
                <th style={{ width: "10%" }}>數量 / 單位</th>
                <th className="text-end">單價</th>
              </tr>
            </thead>
            <tbody>
              {cart.carts?.length > 0 &&
                cart.carts.map((cart) => (
                  <tr key={cart.id}>
                    <td style={{ height: "100px" }}>
                      <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={() => handleDeleteCart(cart.id)}
                        style={{ width: "80%", height: "80%" }}
                      >
                        刪除
                      </button>
                    </td>
                    <td>{cart.product.title}</td>
                    <td
                      style={{
                        width: "100px",
                        height: "100px",
                        overflow: "hidden",
                        position: "relative",
                      }}
                    >
                      <img
                        className="img-fluid"
                        src={cart.product.imageUrl}
                        alt={cart.product.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="btn-group me-2" role="group">
                          <button
                            type="button"
                            className={`btn btn-outline-dark btn-sm ${
                              cart.qty <= 1 ? "bg-secondary" : ""
                            }`}
                            onClick={() =>
                              handleIncreDecreProduct(cart.id, "-")
                            }
                            disabled={cart.qty <= 1 && true}
                          >
                            -
                          </button>
                          <span
                            className="btn border border-dark"
                            style={{ width: "50px", cursor: "auto" }}
                          >
                            {cart.qty}
                          </span>
                          <button
                            type="button"
                            className="btn btn-outline-dark btn-sm"
                            onClick={() =>
                              handleIncreDecreProduct(cart.id, "+")
                            }
                          >
                            +
                          </button>
                        </div>
                        <span className="input-group-text bg-transparent border-0">
                          {cart.product.unit}
                        </span>
                      </div>
                    </td>
                    <td className="text-end">{cart.total}</td>
                  </tr>
                ))}
            </tbody>
            <tfoot>
              <tr>
                <td style={{ width: "150px" }}>
                  {cart.carts?.length > 0 ? (
                    <button
                      className="btn btn-danger"
                      disabled={cart.carts?.length <= 0}
                      style={{ width: "80%" }}
                      onClick={() => handleDeleteCart(null)}
                    >
                      刪除購物車
                    </button>
                  ) : (
                    <td className="text-start">購物車沒有商品</td>
                  )}
                </td>
                <td colSpan="6" className="text-end">
                  總計：{cart.total}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        {cart.carts?.length > 0 && (
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
                      value: 8,
                      message: "地址至少需要輸入8個字",
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
        )}
      </div>

      {/* Modal */}
      <ProductModal
        tempProduct={tempProduct}
        setTempProduct={setTempProduct}
        isProductModalOpen={isProductModalOpen}
        setIsProductModalOpen={setIsProductModalOpen}
        setReload={setReload}
        setIsLoading={setIsLoading}
      />
      {isLoading && (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(255,255,255,0.6)",
            zIndex: 999,
          }}
        >
          <ReactLoading type="spin" color="black" width="4rem" height="4rem" />
        </div>
      )}
    </>
  );
}

export default App;
