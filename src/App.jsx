import { useEffect, useState } from "react";
import { apiService } from "./apiService/apiService";
import { tempProductDefaultValue } from "./data/data";
import { toastInfo } from "./data/dataModel";
import {
  Product,
  ProductModal,
  CustomerInfo,
  LoadingOverlay,
  Carts,
  Toast,
} from "./component";
import { LoadingContext } from "./component/LoadingContext";
const APIPath = import.meta.env.VITE_API_PATH;
function App() {
  const [products, setProducts] = useState([]);
  const [tempProduct, setTempProduct] = useState(tempProductDefaultValue);
  const [cart, setCart] = useState({});
  const [reload, setReload] = useState(true);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isShowToast, setIsShowToast] = useState(false);

  const setToastContent = (toastText, type) => {
    setIsShowToast(true);
    toastInfo.toastText = toastText;
    toastInfo.type = type;
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
      setToastContent("執行完成", "success");
    } catch (error) {
      console.log(error);
      alert(error);
      setToastContent("執行失敗", "error");
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
  const loadingContextValue = {
    setReload,
    setIsLoading,
    setToastContent,
  };
  useEffect(() => {
    if (reload) {
      getProducts();
      getCart();
      setReload(false);
    }
  }, [reload]);

  return (
    <>
      <LoadingContext.Provider value={loadingContextValue}>
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
                  <th className="text-center">數量 / 單位</th>
                  <th className="text-end">單價</th>
                </tr>
              </thead>
              <tbody>
                {cart.carts?.length > 0 &&
                  cart.carts.map((cart) => (
                    <Carts
                      key={cart.id}
                      cart={cart}
                      handleDeleteCart={handleDeleteCart}
                    />
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
                      <span className="text-start">購物車沒有商品</span>
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
            <CustomerInfo/>
          )}
        </div>

        {/* Modal */}
        <ProductModal
          tempProduct={tempProduct}
          isProductModalOpen={isProductModalOpen}
          setIsProductModalOpen={setIsProductModalOpen}
        />
      </LoadingContext.Provider>
      {isLoading && <LoadingOverlay />}
      <Toast
        toastText={toastInfo.toastText}
        type={toastInfo.type}
        isShowToast={isShowToast}
        setIsShowToast={setIsShowToast}
      />
    </>
  );
}

export default App;
