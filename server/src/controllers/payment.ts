import { Request, Response } from "express";
import { init3d, payment3d } from "../services/payment";

export const start3dPaymentController = async (req: Request, res: Response) => {
  const basketId = req.params;
  const {
    cardNumber, cardHolderName, expireMonth, expireYear, cvc, products,
  } = req.body;
  const result = await init3d({
    cardNumber,
    cardHolderName,
    expireMonth,
    expireYear,
    cvc,
    products,
    basketId,
  });

  if (result.error?.errorCode || result.error?.stack) {
    res.status(400).json({
      error: result.error,
    });
    return;
  }

  res.json({ html: result.html });
};

export const render3dPageCountroller = (req: Request, res: Response) => {
  const {
    html,
  } = req.body;
  const rawHtml = Buffer.from(html, "base64").toString("ascii");

  res.type("html");
  res.send(rawHtml);
};

export const continue3dPaymentController = async (req: Request, res: Response) => {
  const { paymentId, conversationData, conversationId } = req.body;

  const response = await payment3d({ conversationData, conversationId, paymentId });

  if (response.error?.stack || response.error?.errorMessage) {
    res.redirect("http://localhost:5173/sepetim");
    return;
  }
  res.redirect("http://localhost:5173/siparislerim");
};
