/* eslint-disable react-hooks/rules-of-hooks */
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useKyc } from "./KycContext"; // Import the context

export async function fetchKyc(user, setKyc, setLoading1, setOpen) {
  const navigate = useNavigate();
  const { setKycStatus } = useKyc(); // Get the setKycStatus function from context
  const token = user.access;

  if (!token) {
    toast.error("Authentication token is missing. Please log in again.");
    navigate("/login");
    setLoading1(false);
    return;
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  try {
    const res = await axios.get(
      `https://omayaexchangebackend.onrender.com/api/kyc/status/`,
      { headers }
    );
    setKyc(res.data);
    setKycStatus(res.data.is_verified); // Update the context with the KYC status
    setLoading1(false);
    if (res.data.is_verified === false) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  } catch (error) {
    console.log(error);
    setLoading1(false);
  }
}
