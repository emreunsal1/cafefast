import React, { useEffect, useState } from "react";
import { Button } from "antd";
import { useRouter } from "next/router";
import BasketList from "@/components/BasketList";
import { useBasket } from "@/context/Basket";

export default function Basket() {
  const { getBasketItems, basketItems } = useBasket();

  const router = useRouter();

  const getBasketData = async () => {
    await getBasketItems({ companyId: router.query.companyId });
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
      {basketItems?.products.length > 0 && (
      <>
        <BasketList data={basketItems} />
        <div className="footer">
          <div className="total">
            {basketItems.totalPriceSymbolText}
            <Button onClick={confirmBasket}>Sepeti Onayla</Button>
          </div>
        </div>
      </>
      )}
      {!basketItems?.products.length && (
      <div className="empty-basket">
        Sepetinizde Hiç Ürün Bulunmamaktadır
      </div>
      )}
    </div>
  );
}
