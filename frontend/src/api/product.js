import api from "./axios";

export const getAllProducts = async () => {
  const res = await api.get("/products");
  return res.data;
};
