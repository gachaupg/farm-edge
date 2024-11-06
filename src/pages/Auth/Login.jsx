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
    initial={{ opacity: 0, x: -50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5 }}
    className="h-full w-full small"
  >
    <div
      style={
        {
          // width: "90%",
        }
      }
      className="flex flex-row border p-3 gap-20  items-center justify-center  mt-10 w-full"
    >
      <div>
        <img
          className="w-full"
          src="https://images.pexels.com/photos/96715/pexels-photo-96715.jpeg?auto=compress&cs=tinysrgb&w=600"
          alt=""
        />
      </div>
      <div className="flex flex-col ">
        <div className=" flex flex-col  ">
          <h4 className="text-lg font-semibold">Welcome</h4>
          <p>Please Login</p>
          <label className="mt-3" htmlFor="">
            Phone Number
          </label>
          <div className="flex gap-2  w-96 items-center   border rounded-2xl border-slate-400">
            <Phone className="green" color="green" />
            <input
              onChange={(e) => setUser({ ...user, phone: e.target.value })}
              type="number"
              style={{ width: "90%" }}
              className=" pl-2 h-8 no-border"
            />
          </div>
          <label className="mt-3" htmlFor="">
            Password
          </label>
          <div className="flex gap-2  w-96 items-center   border rounded-2xl border-slate-400">
            <Lock className="green" color="green" />
            <input
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              type="password"
              className=" w-full pl-2 h-8 no-border"
            />
          </div>
          {loading ? (
            <div className="flex items-center mt-2 justify-center">
              <CircularProgress className="green" />
            </div>
          ) : (
            <button
              onClick={handleSubmit}
              className="greenbg white rounded-2xl w-96 p-1 mt-3"
            >
              Login
            </button>
          )}
          {errors.form && <p className="text-red-500 text-sm">{errors.form}</p>}
        </div>
      </div>
    </div>
    </motion.div>

  );
};

export default Login;
