import { Request, Response } from "express";
import { iyzipayService } from "../services/payment/payment";

const paymentMethod = async (req: Request, res: Response) => {
  const basketId = req.params;
  const ipAddress = req.header("x-forwarded-for") || req.socket.remoteAddress;
  const {
    cardNumber, cardHolderName, expireMonth, expireYear, cvc, products,
  } = req.body;
  const result = await iyzipayService({
    cardNumber, cardHolderName, expireMonth, expireYear, cvc, products,
  });

  if (!result) {
    res.send("Ödeme işleminiz gerçekleştirilemedi geri yönlendiriliyorsunuz!");
    return;
  }

  res.type("html");
  res.send(result);
};

export default paymentMethod;
