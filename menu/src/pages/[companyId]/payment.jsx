import React, { useEffect, useRef, useState } from "react";
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
  const [savedCards, setSavedCards] = useState([]);
  const [savedCardId, setSavedCardId] = useState(savedCards[0] | null);
  const phoneNumber = useRef("");
  const router = useRouter();

  const { getBasketItems, basketItems } = useBasket();

  const getSavedCards = async () => {
    const response = await BASKET_SERVICE.getSavedCards();
    setSavedCards(response.data);
    if (response) {
      setSavedCardId(response.data[0]._id);
    }
  };

  const handleInputFocus = (key) => {
    setCard((prev) => ({ ...prev, focus: key }));
  };
  const inputOnChangeHandler = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    if (name === "phoneNumber") {
      phoneNumber.current = value;
      return;
    }
    setCard((prev) => ({ ...prev, [name]: value }));
  };

  const formSubmitHandler = async (e = null) => {
    if (savedCardId) {
      const response = await BASKET_SERVICE.approveBasket({
        companyId: router.query.companyId,
        savedCardId,
        price: basketItems.totalPrice,
        desk: "A1",
      });
      console.log("response status", response);

      if (response) {
        router.push(`/${router.query.companyId}`);
      }
      return;
    }
    e.preventDefault();
    // TODO: get savedCards from backend, and render saved cards
    const cardData = {
      cardNo: card.number,
      cvv: card.cvc,
      thruMonth: card.expiry.slice(0, 2),
      thruYear: card.expiry.slice(2, 4),
      name: card.name,
    };
    const response = await BASKET_SERVICE.approveBasket({
      companyId: router.query.companyId,
      card: cardData,
      price: basketItems.totalPrice,
      desk: "A1",
      phoneNumber: phoneNumber.current,
    });
    if (response) {
      router.push(`/${router.query.companyId}`);
    }
  };

  const changePaymentMethod = () => {
    if (savedCardId) {
      setSavedCardId(null);
      return;
    }
    setSavedCardId(savedCards[0]._id);
  };

  useEffect(() => {
    getBasketItems({ companyId: router.query.companyId });
    getSavedCards();
  }, []);

  return (
    <div id="payment">
      {savedCardId == null && (
      <>
        {" "}
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
          {!savedCards.length && <input placeholder="phone Number" name="phoneNumber" onChange={(e) => inputOnChangeHandler(e)} />}
          <button type="submit">Ödemeyi Tamamla</button>
        </form>
      </>
      )}
      {savedCards.length > 0 && (
      <div className="saved-cards">
        {savedCardId && (
        <select>
          {savedCards.map((card) => (
            <option value={card._id}>
              {card.cardNo}
              { card.type || card.name}
            </option>
          ))}
        </select>
        )}
        <button onClick={changePaymentMethod}>
          {savedCardId == null ? "Kayıtlı Kart ile öde" : "Başka Kart İle Öde"}
        </button>
        {savedCardId !== null && <button onClick={formSubmitHandler}>Ödemeyi Tamamla</button>}
      </div>

      )}
    </div>
  );
}
