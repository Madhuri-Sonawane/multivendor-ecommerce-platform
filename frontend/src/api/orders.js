import api from "./axios";

export const createOrder = async (productId) => {
  const res = await api.post("/orders", {
    items: [{ productId, quantity: 1 }],
  });
  return res.data;
};
