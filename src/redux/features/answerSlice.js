import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const api = 'https://www.pybreeze.com';

export const getDeposits = createAsyncThunk(
  "deposits/getDeposits",
  async ({ token, toast }, { rejectWithValue }) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get(`${api}/api/users/`, { headers });
      // console.log("API Response:", response.data); // Log the response to check the structure
      // toast.success("Successfully fetched deposits");
      return response.data;
    } catch (err) {
      console.error("Error fetching deposits:", err.response?.data);
      toast.error("Failed to fetch deposits");
      return rejectWithValue(err.response?.data);
    }
  }
);
// 

export const getMatch = createAsyncThunk(
  "deposits/getMatch",
  async ({id, token, toast }, { rejectWithValue }) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.get(`${api}/trading_engine/p2p/trades/${id}/confirm/`, { headers });
      console.log("API Response:", response.data,id); // Log the response to check the structure
      // toast.success("Successfully fetched deposits");
      return response.data;
    } catch (err) {
      console.error("Error fetching deposits:", err.response?.data);
      toast.error("Failed to fetch deposits");
      return rejectWithValue(err.response?.data);
    }
  }
);

export const getWallets = createAsyncThunk(
  "deposits/getWallets",
  async ({ token, toast }, { rejectWithValue }) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get(`${api}/trading_engine/wallets/`, { headers });
      // console.log("API Response:", response.data); // Log the response to check the structure
      // toast.success("Successfully fetched deposits");
      return response.data;
    } catch (err) {
      console.error("Error fetching deposits:", err.response?.data);
      toast.error("Failed to fetch deposits");
      return rejectWithValue(err.response?.data);
    }
  }
);

const deposits = createSlice({
  name: "deposits",
  initialState: {
    deposit: [],
    match:[],
    wallet: [],
    error: "",
    loading: false,
  },

  extraReducers: {
    [getDeposits.pending]: (state) => {
      state.loading = true;
    },
    [getDeposits.fulfilled]: (state, action) => {
      // console.log("Deposits data in state:", action.payload); // Log the data being stored in the state
      state.deposit = action.payload;
      state.loading = false;
    },
    [getDeposits.rejected]: (state, action) => {
      console.error("Error state:", action.payload?.message); // Log the error state
      state.loading = false;
      state.error = action.payload?.message;
    },
    [getWallets.pending]: (state) => {
      state.loading = true;
    },
    [getWallets.fulfilled]: (state, action) => {
      // console.log("Deposits data in state:", action.payload); // Log the data being stored in the state
      state.wallet = action.payload;
      state.loading = false;
    },
    [getWallets.rejected]: (state, action) => {
      console.error("Error state:", action.payload?.message); // Log the error state
      state.loading = false;
      state.error = action.payload?.message;
    },
    [getMatch.pending]: (state) => {
      state.loading = true;
    },
    [getMatch.fulfilled]: (state, action) => {
      console.log("Deposits data in state:", action.payload); // Log the data being stored in the state
      state.match = action.payload;
      state.loading = false;
    },
    [getMatch.rejected]: (state, action) => {
      console.error("Error state:", action.payload?.message); // Log the error state
      state.loading = false;
      state.error = action.payload?.message;
    },
  },
});

export default deposits.reducer;
