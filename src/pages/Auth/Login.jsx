/* eslint-disable no-unused-vars */
import { Email, Lock } from "@mui/icons-material";
import React, { useState } from "react";
import { login } from "../../redux/features/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { Phone } from "lucide-react";
import { motion } from "framer-motion";

const initialState = {
  password: "",
  phone: "",
};

const Login = () => {
  const [verified, setVerified] = useState(false);
  const onChange = (value) => {
    setVerified(true);
  };
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
    setCountdown(30);
    const intervalId = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    setTimeout(() => {
      clearInterval(intervalId);
      setOpen(false);
      navigate("/dashboard");
      window.scrollTo(0, 0);
    }, 30000);
  };
  const handleClose = () => setOpen(false);
  const [user, setUser] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const validate = () => {
    let tempErrors = {};
    tempErrors.phone = user.phone ? "" : "Email is required";
    tempErrors.password = user.password ? "" : "Password is required";
    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("user", user);
    try {
      setLoading(true);
      await dispatch(login({ user, navigate, handleOpen }));
    } catch (error) {
      setErrors({ ...errors, form: "Error logging in invalid credentials" });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const toggleShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };
  return (
    <motion.div
      style={{
        width: "100%",
      }}
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="h-full w-full flex  h-auto mt-1 justify-center "
    >
      <div
        style={{
          width: "80%",
          height: "80%",
        }}
        className="flex flex-row w-full  border border-gray-300 rounded-lg shadow-lg p-6
         gap-12 items-center bg-white w-full "
      >
        <div className="w-full">
          <img
            style={{
              width: "100%",
            }}
            className=" rounded-lg object-cover"
            src="https://images.pexels.com/photos/96715/pexels-photo-96715.jpeg?auto=compress&cs=tinysrgb&w=600"
            alt="Login Image"
          />
        </div>
        <div className="flex flex-col w-full">
          <h4 className="text-2xl font-semibold text-gray-700 mb-2">Welcome to FarmEdge</h4>
          <p className="text-gray-600 mb-6">Please Login</p>

          {/* Phone Number Input */}
          <label className="text-gray-700 mb-1" htmlFor="phone">
            Phone Number
          </label>
          <div className="flex gap-2 w-full items-center border border-slate-300 p-1 rounded-xl  mb-4">
            <Phone className="text-green-500" />
            <input
              id="phone"
              onChange={(e) => setUser({ ...user, phone: e.target.value })}
              type="number"
              className="flex-1 pl-2 h-8 text-gray-700 border-none outline-none"
              placeholder="Enter your phone number"
            />
          </div>

          {/* Password Input */}
          <label className="text-gray-700 mb-1" htmlFor="password">
            Password
          </label>
          <div className="flex gap-2 w-full items-center border border-slate-300 rounded-xl p-1 mb-4">
            <Lock className="text-green-500" />
            <input
              id="password"
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              type="password"
              className="flex-1 pl-2 h-8 text-gray-700 border-none outline-none"
              placeholder="Enter your password"
            />
          </div>

          {/* Submit Button or Loading Indicator */}
          {loading ? (
            <div className="flex items-center justify-center mt-4">
              <CircularProgress className="text-green-500" />
            </div>
          ) : (
            <button
              onClick={handleSubmit}
              className="w-full bg-green-500 text-white font-semibold rounded-xl py-2 mt-4 hover:bg-green-600 transition-colors"
            >
              Login
            </button>
          )}

          {/* Error Message */}
          {errors.form && (
            <p className="text-red-500 text-sm mt-2">{errors.form}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Login;
