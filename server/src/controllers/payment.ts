import { iyzipayService } from "../services/payment/payment";

const paymentMethod = (req, res) => {
  const basketId = req.params;
  const ipAddress = req.header("x-forwarded-for") || req.socket.remoteAddress;
  console.log("ipaddress", ipAddress);
  const {
    cardNumber, cardHolderName, expireMonth, expireYear, cvc, products,
  } = req.body;
  iyzipayService({
    cardNumber, cardHolderName, expireMonth, expireYear, cvc, products,
  });
  res.send("succes");
};

export default paymentMethod;
