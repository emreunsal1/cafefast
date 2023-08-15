import orderModel from "../models/order";
import { ORDERBY_AS_MONGOOSE_SORT, ORDER_BY } from "../enums";

export const createOrder = async (orderData) => {
  try {
    const newOrder = await orderModel.create(orderData);
    return { data: newOrder };
  } catch (error) {
    console.log("error", error);
    return { error: (error as any).message || error };
  }
};

export const getOrders = async (companyId, sortOptions: { createdAt: ORDER_BY } = { createdAt: ORDER_BY.DESC }) => {
  try {
    const sortObject = {
      createdAt: ORDERBY_AS_MONGOOSE_SORT[sortOptions.createdAt],
    };

    const result = await orderModel.find({ company: companyId })
      .sort(sortObject)
      .populate("shopper")
      .populate("products.product")
      .populate({
        path: "campaigns.campaign",
        populate: {
          path: "products",
          model: "product",
        },
      })
      .exec();

    return {
      data: result,
    };
  } catch (error) {
    return {
      error: (error as any).message || error,
    };
  }
};

export const updateOrder = async (orderId, orderData) => {
  try {
    const result = await orderModel.findOneAndUpdate({ _id: orderId }, orderData, { new: true });
    return { data: result };
  } catch (error) {
    return { error: (error as any).message || error };
  }
};

export const deleteMenu = async (orderId) => {
  try {
    const data = await orderModel.findOneAndDelete({ _id: orderId });
    return { data };
  } catch (error) {
    return { error: (error as any).message || error };
  }
};
