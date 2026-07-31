import { apiUsers } from "../api/api";

export const getAll = async () => {
  const res = await apiUsers.get("/");
  return res.data;
};

export const getUserBy = async (id) => {
  const res = await apiUsers.get(`/by/${id}`);
  return res.data;
};

export const createUser = async (data) => {
  const res = await apiUsers.post(`/create`, data);
  return res.data;
};

export const updateUser = async (id, data) => {
  const res = await apiUsers.put(`/update/${id}`, data);
  return res.data;
};

export const deleteUser = async (id) => {
  const res = await apiUsers.put(`/delete/${id}`);
  return res.data;
};
