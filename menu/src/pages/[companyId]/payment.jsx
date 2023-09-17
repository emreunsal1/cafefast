/* eslint-disable react/button-has-type */
import React, { useEffect, useRef, useState } from "react";
import Cards from "react-credit-cards";
import { useBasket } from "@/context/Basket";
import BASKET_SERVICE from "@/services/basket";
import "react-credit-cards/es/styles-compiled.css";
import { useRouter } from "next/router";
import { OTP_SERVICE } from "@/services/otp";
import OtpModal from "@/components/OtpModal";

export default function Payment() {
  const router = useRouter();
  const [savedCards, setSavedCards] = useState([]);
  const [savedCardId, setSavedCardId] = useState(savedCards[0] || null);
  const [needOtp, setNeedOtp] = useState(false);
  const phoneNumber = useRef("");
  const otpCode = useRef("null");
  const [card, setCard] = useState({
    cvc: "",
    expiry: "",
    focus: "name",
    name: "",
    number: "",
  });

  const { getBasketItems, basketItems } = useBasket();

  const formSubmitHandler = async () => {
    try {
      if (savedCardId) {
        await BASKET_SERVICE.approveBasket({
          companyId: router.query.companyId,
          savedCardId,
          price: basketItems.totalPrice,
          desk: "A1",
        });
        router.push(`/${router.query.companyId}`);
        return;
      }

      const cardData = {
        cardNo: card.number,
        cvv: card.cvc,
        thruMonth: card.expiry.slice(0, 2),
        thruYear: card.expiry.slice(2, 4),
        name: card.name,
      };
      await BASKET_SERVICE.approveBasket({
        companyId: router.query.companyId,
        card: cardData,
        price: basketItems.totalPrice,
        desk: "A1",
        phoneNumber: phoneNumber.current,
        otp: otpCode.current,
      });
      router.push(`/${router.query.companyId}`);
    } catch (err) {
      console.log("approve basket error :>> ", err);
    }
  };

  const otpController = async (eventOtp = null) => {
    if (eventOtp) {
      otpCode.current = eventOtp;
      formSubmitHandler();
      return;
    }
    const response = await OTP_SERVICE.needOtp();
    if (response.otpRequired) {
      OTP_SERVICE.sendOtp({ phoneNumber: phoneNumber.current });
      setNeedOtp(true);
    }
  };

  const getSavedCards = async () => {
    try {
      const response = await BASKET_SERVICE.getSavedCards();
      setSavedCards(response.data);
      setSavedCardId(response.data[0]._id);
    } catch (err) {
      console.log("err :>> ", err);
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

  const changePaymentMethod = () => {
    if (savedCardId) {
      setSavedCardId(null);
      return;
    }
    setSavedCardId(savedCards[0]._id);
  };

  useEffect(() => {
    if (router.isReady) {
      getBasketItems({ companyId: router.query.companyId });
      getSavedCards();
    }
  }, [router.isReady]);

  return (
    <div id="payment">
      {savedCardId == null && (
      <>
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
          <button type="button" onClick={() => otpController()}>Ödemeyi Tamamla</button>
        </form>
      </>
      )}
      {savedCards.length > 0 && (
      <div className="saved-cards">
        {savedCardId && (
        <select>
          {savedCards.map((_card) => (
            <option value={_card._id}>
              {_card.cardNo}
              { _card.type || _card.name}
            </option>
          ))}
        </select>
        )}
        <button onClick={changePaymentMethod}>
          {savedCardId == null ? "Kayıtlı Kart ile öde" : "Başka Kart İle Öde"}
        </button>
        {savedCardId !== null && <button type="button" onClick={otpController}>Yeni kart ile Ödemeyi Tamamla</button>}
      </div>

      )}
      {needOtp && <OtpModal setModalIsOpen={setNeedOtp} submitClickHandler={otpController} />}
    </div>
  );
}
