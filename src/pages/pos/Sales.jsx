/* eslint-disable no-unused-vars */
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Sales = () => {
  const { user } = useSelector((state) => ({ ...state.auth }));

  const [loading1, setLoading1] = useState(false);
  const [pos, setPos] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [totalUnsettled, setUnsettled] = useState(0);

  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [quantity, setQuantity] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [crops, setCrops] = useState([]);
  const [users, setUsers] = useState([]);
  const [units, setUnits] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "https://shamba-new-sever.netlify.app/.netlify/functions/api/unit"
        );
        const filter = res.data.filter(
          (item) => item.farm === user?.user?.farm
        );
        setUnits(filter);

        setLoading1(false);
      } catch (error) {
        console.log(error);
        setLoading1(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          " https://shamba-new-sever.netlify.app/.netlify/functions/api/auth"
        );
        const filter = res.data.filter(
          (item) => item.farm === user?.user?.farm
        );
        setUsers(filter);

        setLoading1(false);
      } catch (error) {
        console.log(error);
        setLoading1(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "https://shamba-new-sever.netlify.app/.netlify/functions/api/crop"
        );
        const filter = res.data.filter(
          (item) => item.farm === user?.user?.farm
        );
        setCrops(filter);

        setLoading1(false);
      } catch (error) {
        console.log(error);
        setLoading1(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading1(true);
      try {
        const res = await axios.get(
          "https://shamba-new-sever.netlify.app/.netlify/functions/api/pos"
        );
        const filter = res.data.filter(
          (item) => item.farm === user?.user?.farm
        );
        setPos(filter);

        // Calculate totals for each category
        const expensesTotal = filter
          .filter((item) => item.category === "Expenses")
          .reduce((sum, item) => sum + item.amount, 0);

        const salesTotal = filter
          .filter((item) => item.category === "Sales")
          .reduce((sum, item) => sum + item.amount, 0);

        const salesUnsettled = filter.filter(
          (item) => item.category === "Sales" && !item.status
        ).length;

        setUnsettled(salesUnsettled);
        setTotalExpenses(expensesTotal);
        setTotalSales(salesTotal);
        setLoading1(false);
      } catch (error) {
        console.log(error);
        setLoading1(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [user?.access, navigate]);
  const [load, setLoad] = useState(false);
  const handleRecordSale = async () => {
    if (!selectedProduct || !selectedUnit || !quantity || !amount) {
      alert("Please fill in all fields");
      return;
    }

    const postData = {
      item: selectedProduct,
      category: "Sales",
      unitMeasure: selectedUnit,
      amount: Number(amount),
      remarks: description,
      quantity: Number(quantity),
      type: "Sales",
      farm: user?.user?.farm,
      worker: user?.user?.name,
      token: user?.user?.token || "",
    };

    try {
      setLoad(true);
      const response = await axios.post(
        "https://shamba-new-sever.netlify.app/.netlify/functions/api/pos/create",
        postData
      );
      console.log("Record added:", response.data);
      toast.success("Record added successfully");
      navigate("/");
      setLoad(false);
      // Optionally clear fields or update state with new record
    } catch (error) {
      console.error("Error posting data:", error);
      setLoad(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        style={{ width: "65%" }}
        className="flex border border-slate-300 p-4 rounded-lg flex-col mt-6"
      >
        <h1>Record Sales</h1>
        <select
          className="w-full mt-5 border p-1 rounded-lg"
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
        >
          <option value="">Select Crop</option>
          {crops.map((crop) => (
            <option key={crop._id} value={crop.name}>
              {crop.name}
            </option>
          ))}
        </select>
        <select
          className="w-full mt-5 border p-1 rounded-lg"
          value={selectedUnit}
          onChange={(e) => setSelectedUnit(e.target.value)}
        >
          <option value="">Select Unit</option>
          {units.map((unit) => (
            <option key={unit._id} value={unit.item}>
              {unit.item}
            </option>
          ))}
        </select>
        <input
          type="number"
          className="w-full mt-5 border p-1 rounded-lg"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
        <input
          type="number"
          className="w-full mt-5 border p-1 rounded-lg"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <input
          type="text"
          className="w-full mt-5 border p-1 rounded-lg"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button
          className="w-full mt-5 border p-1 rounded-lg greenbg text-white"
          onClick={handleRecordSale}
          disabled={loading1}
        >
          {load ? "Recording..." : "Record Sale"}
        </button>
      </div>
    </div>
  );
};

export default Sales;
