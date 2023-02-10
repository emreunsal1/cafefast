import React, { useState } from "react";
import instance from "../utils/axios";
import { API_URl } from "../constants";

export default function Payment() {
  const [card, setCard] = useState({});
  const [responseHtml, setresponseHtml] = useState();

  const redirectPayment = (response) => {
    const newForm = document.createElement("form");
    newForm.method = "POST";
    newForm.action = `${API_URl}/payment/3d-start`;
    const newInput = document.createElement("input");
    newInput.name = "html";
    newInput.value = response.html;
    newForm.appendChild(newInput);
    document.body.appendChild(newForm);
    newForm.submit();
  };

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
      console.log(response.data);
      redirectPayment(response.data)4;
    } catch (error) {
      console.log("errrere", error);
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
