import { Request, Response } from "express";
import { iyzipayService } from "../services/payment/payment";

export const start3dPaymentController = async (req: Request, res: Response) => {
  const basketId = req.params;
  const ipAddress = req.header("x-forwarded-for") || req.socket.remoteAddress;
  const {
    cardNumber, cardHolderName, expireMonth, expireYear, cvc, products,
  } = req.body;
  const result = await iyzipayService({
    cardNumber, cardHolderName, expireMonth, expireYear, cvc, products,
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

export const continue3dPaymentController = (req: Request, res: Response) => {
  const {
    status, paymentId, conversationData, conversationId, mdStatus,
  } = req.body;

  console.log("body :>> ", {
    status, paymentId, conversationData, conversationId, mdStatus,
  });

  res.send(req.body);
};
