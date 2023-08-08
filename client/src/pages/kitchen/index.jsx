import React, { useEffect, useState } from "react";
import COMPANY_SERVICE from "@/services/company";
import OrderList from "@/components/orderList";
import { useSocket } from "@/context/SocketContext";

export default function Index() {
  const [orders, setOrders] = useState([]);
  const { listener } = useSocket();

  const getOrders = async () => {
    const response = await COMPANY_SERVICE.getOrders();
    setOrders(response);
  };

  useEffect(() => {
    getOrders();
    listener("refresh:kitchen", () => { getOrders(); });
  }, []);

  return (
    <div>
      <div className="orders-table">
        {orders.length !== 0 && <OrderList data={orders} />}
      </div>
    </div>
  );
}
