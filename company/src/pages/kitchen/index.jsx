import React, { useEffect, useState } from "react";
import COMPANY_SERVICE from "@/services/company";
import OrderList from "@/components/orderList";
import { useSocket } from "@/context/SocketContext";
import { useLoading } from "@/context/LoadingContext";
import { useMessage } from "@/context/GlobalMessage";

export default function Index() {
  const [orders, setOrders] = useState([]);
  const { listener, socket } = useSocket();
  const { loading, setLoading } = useLoading();
  const message = useMessage();

  const getOrders = async () => {
    setLoading(true);
    const response = await COMPANY_SERVICE.getOrders();
    setOrders(response);
    setLoading(false);
  };

  useEffect(() => {
    getOrders();
  }, []);

  const onUpdate = async () => {
    await getOrders();
    message.success("Sipariş başarıyla güncellendi");
  };

  useEffect(() => {
    if (socket !== null) {
      listener("refresh:kitchen", () => getOrders());
    }
  }, [socket]);

  return (
    <div className="kitchen-page">
      <h3>Mutfak</h3>
      <div className="orders-table">
        {!loading && <OrderList data={orders} onUpdate={onUpdate} />}
        {!loading && orders.length === 0 && <div>Hiç siparişiniz bulunmamaktadır</div>}
      </div>
    </div>
  );
}
