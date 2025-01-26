import { useEffect, useRef, useState } from "react";
import { apiService } from "./apiService/apiService";
import { Modal } from "bootstrap";
import { tempProductDefaultValue } from "./data/data";
import { Product, ProductModal } from "./component";
const APIPath = import.meta.env.VITE_API_PATH;
function App() {
  const [products, setProducts] = useState([]);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  // const [productDetail, setProductDetail] = useState(null);
  const [tempProduct, setTempProduct] = useState(tempProductDefaultValue);
  const handleSeeMore = (productId) => {
    const temp = products.find((item) => item.id === productId);
    setTempProduct(temp);
    openProductDetailModal();
  };
  const getProducts = async () => {
    try {
      const response = await apiService.axiosGetProductData(
        `/api/${APIPath}/products`
      );
      setProducts(response.data.products);
    } catch (error) {
      console.log(error);
    }
  };
  const openProductDetailModal = () => {
    setIsProductModalOpen(true);
  };
  useEffect(() => {
    getProducts();
  }, []);
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
                ></Product>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Modal */}
      <ProductModal
        tempProduct={tempProduct}
        isProductModalOpen={isProductModalOpen}
        setIsProductModalOpen={setIsProductModalOpen}
      />
    </>
  );
}

export default App;
