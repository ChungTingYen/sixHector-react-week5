import { useEffect, useRef, useState } from "react";
import { apiService } from "./apiService/apiService";
import { Modal } from "bootstrap";
import { tempProductDefaultValue } from "./data/data";
import { Product, ProductModal } from "./component";
const APIPath = import.meta.env.VITE_API_PATH;
function App() {
  const [products, setProducts] = useState([]);
  const [tempProduct, setTempProduct] = useState(tempProductDefaultValue);
  const [cart, setCart] = useState({});
  const [reload, setReload] = useState(true);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const cartRef = useRef(null);
  // const [productDetail, setProductDetail] = useState(null);

  const handleSeeMore = (productId) => {
    const temp = products.find((item) => item.id === productId);
    setTempProduct(temp);
    openProductDetailModal();
  };
  const handleDeleteCart = async (cartId = null) => {
    //如果有cardId就是刪除一個，沒有就是刪除全部
    const path = `api/${APIPath}/cart` + (cartId ? `/${cartId}` : "s");
    try {
      await apiService.axiosDelete(path);
      setReload(true);
    } catch (error) {
      console.log(error);
      alert(error);
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
    try {
      const {
        data: { products, pagination, success, message },
      } = await apiService.axiosGet(`/api/${APIPath}/products`);
      setProducts(products);
    } catch (error) {
      console.log(error);
    }
  };

  const openProductDetailModal = () => {
    setIsProductModalOpen(true);
  };
  const handleIncreDecreProduct = async (cartId, type) => {
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
  //   console.log(cart.carts?.length);
  // });
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
      </div>

      {/* Modal */}
      <ProductModal
        tempProduct={tempProduct}
        isProductModalOpen={isProductModalOpen}
        setIsProductModalOpen={setIsProductModalOpen}
        setReload={setReload}
      />
    </>
  );
}

export default App;
