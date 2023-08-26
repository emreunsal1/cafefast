import React, { useEffect, useState } from "react";
import Cards from "react-credit-cards";
import { useBasket } from "@/context/Basket";
import BASKET_SERVICE from "@/services/basket";
import "react-credit-cards/es/styles-compiled.css";
import { useRouter } from "next/router";

export default function Payment() {
  const [card, setCard] = useState({
    cvc: "",
    expiry: "",
    focus: "name",
    name: "",
    number: "",
  });
  const rouuter = useRouter();

  const { getBasketItems, basketItems } = useBasket();

  useEffect(() => {
    getBasketItems({ companyId: "64208d2c890cdcf8376c87a5" });
  }, []);

  const handleInputFocus = (key) => {
    setCard((prev) => ({ ...prev, focus: key }));
  };
  const inputOnChangeHandler = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    setCard((prev) => ({ ...prev, [name]: value }));
  };

  const formSubmitHandler = async (e) => {
    e.preventDefault();
    const cardData = {
      cardNo: card.number,
      cvv: card.cvc,
      thruMonth: card.expiry.slice(0, 2),
      thruYear: card.expiry.slice(2, 4),
      name: card.name,
    };
    const response = await BASKET_SERVICE.approveBasket({
      companyId: "64208d2c890cdcf8376c87a5", card: cardData, price: basketItems.totalPrice, desk: "A1",
    });
    if (response) {
      rouuter.push("/");
    }
  };

  return (
    <div id="payment">
      <Cards
        cvc={card.cvc}
        expiry={card.expiry}
        focused={card.focus}
        name={card.name}
        number={card.number}
      />
      <form onSubmit={formSubmitHandler}>
        <input placeholder="name" name="name" onChange={(e) => inputOnChangeHandler(e)} onFocus={() => handleInputFocus("name")} />
        <input placeholder="card number" name="number" onChange={(e) => inputOnChangeHandler(e)} onFocus={() => handleInputFocus("number")} />
        <input placeholder="cvc" name="cvc" onChange={(e) => inputOnChangeHandler(e)} onFocus={() => handleInputFocus("cvc")} />
        <input placeholder="expiry" name="expiry" onChange={(e) => inputOnChangeHandler(e)} onFocus={() => handleInputFocus("expiry")} />
        <button type="submit">Ödemeyi Tamamla</button>
      </form>
    </div>
  );
}
