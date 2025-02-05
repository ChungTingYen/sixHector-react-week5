/* eslint-disable react/prop-types */
import { useRef, useEffect, useState } from "react";
import ReactLoading from "react-loading";
import { apiService } from "../apiService/apiService";
import { Modal } from "bootstrap";
import { useLoading } from "../component/LoadingContext";
const APIPath = import.meta.env.VITE_API_PATH;
const ProductModal = (props) => {
  const {
    tempProduct,
    setIsProductModalOpen,
    isProductModalOpen,
    // setReload,
    // setToastContent,
  } = props;
  const { setReload, setToastContent } = useLoading();
  const productModalRef = useRef(null);
  const [qtySelect, setQtySelect] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const closeProductModal = () => {
    const modalInstance = Modal.getInstance(productModalRef.current);
    modalInstance.hide();
    setIsProductModalOpen(false);
    setQtySelect(1);
    setReload(true);
  };
  const openProductModal = () => {
    const modalInstance = Modal.getInstance(productModalRef.current);
    modalInstance.show();
  };
  const addProductTocart = async () => {
    setIsLoading(true);
    try {
      const postData = {
        data: {
          product_id: tempProduct.id,
          qty: qtySelect,
        },
      };
      const response = await apiService.axiosPost(
        `/api/${APIPath}/cart`,
        postData
      );
      // setReload(true);
      // closeProductModal();
      setToastContent("執行完成", "success");
    } catch (error) {
      console.log(error);
      setToastContent("執行失敗", "error");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (productModalRef.current)
      new Modal(productModalRef.current, { backdrop: false });
  }, []);
  useEffect(() => {
    if (isProductModalOpen) {
      openProductModal();
    }
  }, [isProductModalOpen]);
  return (
    <>
      <div
        ref={productModalRef}
        style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 999 }}
        className="modal fade"
        id="productModal"
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title fs-5">
                產品名稱：{tempProduct.title}
              </h2>
              <button
                onClick={closeProductModal}
                type="button"
                className="btn-close"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <img
                src={tempProduct.imageUrl}
                alt={tempProduct.title}
                className="img-fluid"
              />
              <p>內容：{tempProduct.content}</p>
              <p>描述：{tempProduct.description}</p>
              <p>
                價錢：<span className="text-danger">{tempProduct.price} </span>
                <span>
                  <del>{tempProduct.origin_price}</del> 元
                </span>
              </p>
              <div className="input-group align-items-center">
                <label htmlFor="qtySelect">數量：</label>
                <select
                  value={qtySelect}
                  onChange={(e) => setQtySelect(parseInt(e.target.value))}
                  id="qtySelect"
                  className="form-select"
                >
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary d-flex align-items-center gap-2"
                disabled={isLoading}
                onClick={addProductTocart}
              >
                <div>加入購物車ReactLoading</div>
                {isLoading && (
                  <ReactLoading
                    type={"spin"}
                    color={"#000"}
                    height={"1.5rem"}
                    width={"1.5rem"}
                  />
                )}
              </button>
              <button
                type="button"
                className="btn btn-danger"
                aria-label="Close"
                onClick={closeProductModal}
              >
                關閉
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default ProductModal;
