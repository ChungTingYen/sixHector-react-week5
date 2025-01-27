/* eslint-disable react/prop-types */
import { apiService } from "../apiService/apiService";
const APIPath = import.meta.env.VITE_API_PATH;
const Product = (props) => {
  const { product, handleSeeMore, setReload } = props;
  const atHandleSeeMore = () => {
    handleSeeMore(product.id);
  };
  const handleAddProductToCart = async () => {
    try {
      const postData = {
        data: {
          product_id: product.id,
          qty: 1,
        },
      };
      await apiService.axiosPost(`/api/${APIPath}/cart`, postData);
      setReload(true);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <tr key={product.id}>
      <td
        style={{
          width: "150px",
          height: "150px",
          overflow: "hidden",
          position: "relative",
          cursor: "pointer",
        }}
        onClick={atHandleSeeMore}
      >
        <img
          className="img-fluid"
          src={product.imageUrl}
          alt={product.title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </td>
      <td>{product.title}</td>
      <td>
        <del className="h6">原價 {product.origin_price} 元</del>
        <div className="h5 text-danger">特價 {product.price} 元</div>
      </td>
      <td>
        <div className="btn-group btn-group-sm">
          <button
            onClick={atHandleSeeMore}
            type="button"
            className="btn btn-outline-secondary"
          >
            查看更多
          </button>
          <button
            type="button"
            className="btn btn-outline-danger"
            onClick={handleAddProductToCart}
          >
            加到購物車
          </button>
        </div>
      </td>
    </tr>
  );
};
export default Product;
