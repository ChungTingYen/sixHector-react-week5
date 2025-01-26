/* eslint-disable react/prop-types */
import { useRef, useEffect } from "react";
import { Modal } from "bootstrap";

const ProductModal = (props) => {
  const { tempProduct, setIsProductModalOpen, isProductModalOpen } = props;
  const productModalRef = useRef(null);

  const closeProductModal = () => {
    const modalInstance = Modal.getInstance(productModalRef.current);
    modalInstance.hide();
    setIsProductModalOpen(false);
  };

  useEffect(() => {
    if (productModalRef.current)
      new Modal(productModalRef.current, { backdrop: false });
  }, []);
  useEffect(() => {
    if (isProductModalOpen) {
      const modalInstance = Modal.getInstance(productModalRef.current);
      modalInstance.show();
    }
  }, [isProductModalOpen]);
  return (
    <>
      <div
        ref={productModalRef}
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
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
                  // value={qtySelect}
                  // onChange={(e) => setQtySelect(e.target.value)}
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
              <button type="button" className="btn btn-primary">
                加入購物車
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
