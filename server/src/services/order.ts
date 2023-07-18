import orderModel from "../models/order";

export const createOrder = async (orderData) => {
  try {
    const newOrder = await orderModel.create(orderData);
    return { data: newOrder };
  } catch (error) {
    return { error: (error as any).message || error };
  }
};

export const getOrders = async (companyId) => {
  try {
    const result = await orderModel.find({ company: companyId }).populate("shopper").populate("products.product").populate({
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
