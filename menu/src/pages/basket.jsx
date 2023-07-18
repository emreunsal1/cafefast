import React, { useEffect, useState } from "react";
import { Button, Space } from "antd";
import { useRouter } from "next/router";
import BASKET_SERVICE from "@/services/basket";
import BasketList from "@/components/BasketList";
import { useBasket } from "@/context/Basket";

export default function Basket() {
  const { getBasketItems } = useBasket();
  const [basketData, setBasketData] = useState(null);

  const router = useRouter();

  const getBasketData = async () => {
    const response = await getBasketItems({ companyId: "64208d2c890cdcf8376c87a5" });
    console.log("basket in reponze ", response);
    setBasketData(response);
  };

  const confirmBasket = () => {
    router.push("./payment");
  };

  useEffect(() => {
    getBasketData();
  }, []);

  return (
    <div>
      {basketData?.products.length && (
      <>
        <BasketList data={basketData.products} />
        <div className="footer">
          <div className="total">
            {basketData.totalPriceSymbolText}
            <Button onClick={confirmBasket}>Sepeti Onayla</Button>
          </div>
        </div>
      </>
      )}
    </div>
  );
}
