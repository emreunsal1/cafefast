import { AxiosError } from "axios";
import React, { useState } from "react";
import instance from "../utils/axios";
import { redirectToPayment } from "../utils/payment";

export default function Payment() {
  const [card, setCard] = useState({});

  const submitHandler = async () => {
    try {
      const response = await instance.post("/payment/iyzi/1", {
        cardNumber: "5890040000000016",
        cardHolderName: "Emre Ünsal",
        expireMonth: "04",
        expireYear: "2028",
        cvc: "123",
        products: [{
          id: "1",
          name: "coffe",
          category1: "food",
          price: "5",
        }],
      });
      redirectToPayment(response.data);
    } catch (err) {
      if (err instanceof AxiosError) {
        console.log(err.response?.data);
      }
    }
  };

  return (
    <div>
      <input placeholder="num" value={58900400000001} onChange={(e) => setCard({ ...card, cardNumber: e.target.value })} />
      <input placeholder="holder" value="Emre Ünsal" onChange={(e) => setCard({ ...card, cardHolderName: e.target.value })} />
      <input placeholder="expm" value="04" onChange={(e) => setCard({ ...card, expireMonth: e.target.value })} />
      <input placeholder="expy" value={2028} onChange={(e) => setCard({ ...card, expireYear: e.target.value })} />
      <input placeholder="cvc" value={123} onChange={(e) => setCard({ ...card, cvc: e.target.value })} />
      <button type="submit" onClick={submitHandler}>Yolla</button>
    </div>
  );
}
