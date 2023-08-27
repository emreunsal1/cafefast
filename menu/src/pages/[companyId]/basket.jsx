import React, { useEffect, useState } from "react";
import { Button } from "antd";
import { useRouter } from "next/router";

import BasketList from "@/components/BasketList";
import { useBasket } from "@/context/Basket";

export default function Basket() {
  const { getBasketItems } = useBasket();
  const [basketData, setBasketData] = useState(null);

  const router = useRouter();

  const getBasketData = async () => {
    const response = await getBasketItems({ companyId: router.query.companyId });
    setBasketData(response);
  };

  const confirmBasket = () => {
    router.push(`/${router.query.companyId}/payment`);
  };

  useEffect(() => {
    if (router.isReady) {
      getBasketData();
    }
  }, [router.isReady]);

  return (
    <div>
      {basketData?.products.length && (
      <>
        <BasketList data={basketData} />
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
