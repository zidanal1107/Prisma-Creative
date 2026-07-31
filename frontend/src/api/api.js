import axios from "axios";

export const apiUsers = axios.create({
  baseURL: "http://localhost:3001/users",
});
