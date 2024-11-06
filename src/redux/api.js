import axios from "axios";
import { endpoint } from "../utils/APIRoutes";

const API = axios.create({
  baseURL:endpoint
});

API.interceptors.request.use((req) => {
  if (localStorage.getItem("profile")) {
    req.headers.Authorization = `Bearer ${
      JSON.parse(localStorage.getItem("profile")).token
    }`;
  }
  return req;

  
});
export const googleSignIn = (result) => API.post("/users/google-signin", result);

export const signIn = (formData) => API.post("/users/signin", formData);
export const signUp = (formData) => API.post("/users/signup", formData);
export const getDeposits=()=>API.get('/trading_engine/wallets/');
export const createWidthdrawal = (formData) => API.post("/trading_engine/p2p-withdraw/", formData);
export const createMpesa = (formData) => API.post("/mpesa/stkPush", formData);
export const createInvoice = (formData) => API.post("/invoice", formData);
export const createMessage = (formData) => API.post("/scripts", formData);
export const createHelp = (formData) => API.post("/orders", formData);
export const createAnswer = (formData) => API.post("/answer", formData);
export const deleteTour = (id) => API.delete(`/products/delete-user-content/${id}`);
export const updateSeller = (form, id) =>
  API.patch(`users/update-seller/${id}`, form);

  export const updateProducts = (form, id) =>
  API.patch(`users/update-seller/${id}`, form);
  export const updateBought = (form, id) =>
  API.patch(`products/update-bought/${id}`, form);
  export const updateReview = (form, id) =>
  API.put(`products/rate/${id}`, form);
  export const createDeposit = (formData) => API.post("/trading_engine/deposit/", formData);
