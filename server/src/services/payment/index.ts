import Iyzipay from "iyzipay";
import dotenv from "dotenv";

dotenv.config();

const iyzipay = new Iyzipay({
  apiKey: process.env.IYZIPAY_API,
  secretKey: process.env.IYZIPAY_SECRET,
  uri: process.env.IYZIPAY_API_URI,
});

export const payment3d = ({
  conversationId,
  paymentId,
  conversationData,
}): Promise<{ error?: {stack: any, errorMessage: any, errorCode: any}, result?: any }> => new Promise((resolve) => {
  iyzipay.threedsPayment.create({
    conversationId, locale: Iyzipay.LOCALE.TR, paymentId, conversationData,
  }, (error, result) => {
    if (error || result.status === "failure") {
      resolve({
        error: {
          stack: error,
          ...result,
        },
      });
      return;
    }
    resolve({
      result,
    });
  });
});

export const init3d = ({
  cardNumber, cardHolderName, expireMonth, expireYear, cvc, products,
}): Promise<{ html?: object, error?: { stack: any, errorCode: string } }> => {
  let totalPrice = 0;

  const mappedProducts = products.map((product) => {
    const newProduct = product;
    newProduct.itemType = Iyzipay.BASKET_ITEM_TYPE.PHYSICAL;
    totalPrice += product.price;
    return product;
  });

  const paymentInfo = {
    locale: Iyzipay.LOCALE.TR,
    conversationId: "123456789",
    price: totalPrice,
    paidPrice: totalPrice,
    currency: Iyzipay.CURRENCY.TRY,
    installment: "1",
    basketId: "B67832",
    paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
    paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
    callbackUrl: `http://localhost:${process.env.PORT}/payment/3d-continue`,
    paymentCard: {
      cardHolderName,
      cardNumber,
      expireMonth,
      expireYear,
      cvc,
      registerCard: "0",
    },
    buyer: {
      id: "BY789",
      name: "Emre",
      surname: "Ünsal",
      gsmNumber: "+905350000000",
      email: "email@email.com",
      identityNumber: "11111111111",
      lastLoginDate: "2015-10-05 12:43:35",
      registrationDate: "2013-04-21 15:12:09",
      registrationAddress: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
      ip: "85.34.78.112",
      city: "Istanbul",
      country: "Turkey",
      zipCode: "34732",
    },
    shippingAddress: {
      contactName: "Jane Doe",
      city: "Istanbul",
      country: "Turkey",
      address: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
      zipCode: "34742",
    },
    billingAddress: {
      contactName: "Jane Doe",
      city: "Istanbul",
      country: "Turkey",
      address: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
      zipCode: "34742",
    },
    basketItems: mappedProducts,
  };

  return new Promise((resolve) => {
    iyzipay.threedsInitialize.create(paymentInfo, (error, result) => {
      if (error || result.errorCode) {
        console.log("Error when iyzicoPayment => ", error, result);
        resolve({
          error: {
            stack: error,
            ...result,
          },
        });
        return;
      }
      resolve({ html: result.threeDSHtmlContent });
    });
  });
};
