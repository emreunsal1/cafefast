import Select from "@/components/library/Select";
import { ORDER_STATUSES, ORDER_STATUS_TEXTS } from "@/constants";
import { useMessage } from "@/context/GlobalMessage";
import { useLoading } from "@/context/LoadingContext";
import COMPANY_SERVICE from "@/services/company";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useImmer } from "use-immer";

export default function OrderDetail() {
  const router = useRouter();
  const [order, setOrder] = useImmer(null);
  const message = useMessage();

  const { setLoading } = useLoading();

  const fetchOrderDetail = async () => {
    setLoading(true);
    const response = await COMPANY_SERVICE.getOrderDetail(router.query.orderId);
    setOrder(response.data);
    setLoading(false);
  };

  const statusOnChangeHandler = async (status) => {
    if (status === order.status) {
      return;
    }
    setLoading(true);
    await COMPANY_SERVICE.updateOrder(order._id, { status });
    setOrder((_order) => { _order.status = status; });
    const successMessage = (
      <div>
        Sipariş durumunuz
        {" "}
        <b>{ORDER_STATUS_TEXTS[status]}</b>
        {" "}
        olarak güncellendi
      </div>
    );
    message.success(successMessage);
    setLoading(false);
  };

  useEffect(() => {
    if (router.isReady) {
      fetchOrderDetail();
    }
  }, [router.isReady]);

  if (!order) {
    return null;
  }

  const createStatusItem = (status) => ({ value: status, label: ORDER_STATUS_TEXTS[status] });

  return (
    <div className="order-detail-page">
      <div className="order-detail-page-header">
        <h4>Sipariş Detayı</h4>

        <div className="order-number">
          <p>Sipariş Numarası:</p>
          <span>{order._id}</span>
        </div>
      </div>

      <div className="order-detail-page-order-status">
        <h6>Sipariş Durumu</h6>
        <Select
          value={createStatusItem(order.status)}
          onChange={(status) => statusOnChangeHandler(status.value)}
          options={ORDER_STATUSES.map((status) => createStatusItem(status))}
        />
      </div>

      <div className="order-detail-page-products">
        <div className="products-header">
          <h6>Ürünler</h6>
        </div>
        <div className="products-body">
          {order.products.map((orderProduct) => (
            <div key={orderProduct._id} className="products-body-item">
              <div className="product-item-image"><img src={orderProduct.images[0]} alt="" /></div>
              <div className="product-item-name">{orderProduct.name}</div>
              <div className="product-item-quantity">{orderProduct.count}</div>
              <div className="product-item-price">{orderProduct.priceAsText}</div>
            </div>
          ))}

        </div>
      </div>

      <div className="order-detail-page-order-info">
        <div className="order-info-header">
          <h6>Sipariş Bilgileri</h6>
        </div>
        <div className="shopper-info">
          Müşteri İsmi:
          {" "}
          {order.shopper.name}
        </div>
        <div className="desk-info">
          Masa:
          {" "}
          {order.desk}
        </div>

        <div className="price-info">
          Toplam Fiyat:
          {" "}
          {order.totalPriceSymbolText}
        </div>
      </div>
    </div>
  );
}
