/* eslint-disable no-unused-vars */
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LineChart } from "@mui/x-charts/LineChart";
import { Pie } from "react-chartjs-2"; // Pie chart import (use react-chartjs-2)
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"; // Chart.js setup

// Register chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const Main = () => {
  const { user } = useSelector((state) => ({ ...state.auth }));

  const [loading1, setLoading1] = useState(false);
  const [pos, setPos] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [totalUnsettled, setUnsettled] = useState(0);
  const [currentChartData, setCurrentChartData] = useState([]);
  const [currentChartLabel, setCurrentChartLabel] = useState("Sales");
  const [activeButton, setActiveButton] = useState("Sales");
  const [crops, setCrops] = useState([]);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  console.log("pos", pos);

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

        // Set initial chart data to sales by default
        handleShowSales();
      } catch (error) {
        console.log(error);
        setLoading1(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [user?.access, navigate]);

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
      try {
        const res = await axios.get(
          "https://shamba-new-sever.netlify.app/.netlify/functions/api/auth"
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

  const prepareChartData = (dataType) => {
    const monthlyData = Array(12).fill(0);
    pos.forEach((item) => {
      const monthIndex = new Date(item.createdAt).getMonth();
      if (dataType === "Sales" && item.category === "Sales") {
        monthlyData[monthIndex] += item.amount;
      } else if (dataType === "Expenses" && item.category === "Expenses") {
        monthlyData[monthIndex] += item.amount;
      }
    });
    return monthlyData;
  };

  const handleShowSales = () => {
    const salesData = prepareChartData("Sales");
    setCurrentChartData(salesData);
    setCurrentChartLabel("Sales");
    setActiveButton("Sales");
  };

  const handleShowExpenses = () => {
    const expensesData = prepareChartData("Expenses");
    setCurrentChartData(expensesData);
    setCurrentChartLabel("Expenses");
    setActiveButton("Expenses");
  };

  const handleShowProfitLoss = () => {
    const profitData = prepareChartData("Sales").map((sale, index) => {
      const expense = prepareChartData("Expenses")[index];
      return sale - expense;
    });
    setCurrentChartData(profitData);
    setCurrentChartLabel("Profit/Loss");
    setActiveButton("ProfitLoss");
  };

  const handleShowAll = () => {
    const salesData = prepareChartData("Sales");
    const expensesData = prepareChartData("Expenses");
    setCurrentChartData([salesData, expensesData]);
    setCurrentChartLabel("All");
    setActiveButton("All");
  };

  const preparePieData = () => ({
    labels: ["Sales", "Expenses"],
    datasets: [
      {
        data: [totalSales, totalExpenses],
        backgroundColor: ["#36A2EB", "#FF6384"],
        hoverBackgroundColor: ["#36A2EB", "#FF6384"],
      },
    ],
  });

  return (
    <div className="w-full p-2 flex flex-col">
      <div className="flex flex items-center pl-10 flex-wrap gap-20 row small">
        <div className="greenbg h-28 w-64 flex flex-col pl-16 justify-center text-white p-1 rounded-lg">
          <p>Total Sales</p>
          <p>KSH: {totalSales}</p>
        </div>
        <div className="bg-red-700 h-28 w-64 flex flex-col pl-16 justify-center text-white p-1 rounded-lg">
          <p>Total Expenses</p>
          <p>KSH: {totalExpenses}</p>
        </div>
        <div className="bg-blue-700 h-28 w-64 flex flex-col pl-16 justify-center text-white p-1 rounded-lg">
          <p>Total Profit</p>
          <p>
            KSH: {totalSales - totalExpenses}{" "}
            <span
              className={`${
                totalSales - totalExpenses > 0
                  ? "text-green-700"
                  : "text-red-700"
              }`}
            >
              {totalSales - totalExpenses > 0 ? "profit" : "loss"}
            </span>
          </p>
        </div>
        <div className="bg-orange-700 h-28 w-64 flex flex-col pl-16 justify-center text-white p-1 rounded-lg">
          <p>Total Crops</p>
          <p>Crops: {crops.length}</p>
        </div>
        <div className="bg-slate-700 h-28 w-64 flex flex-col pl-16 justify-center text-white p-1 rounded-lg">
          <p>Total Unsettled Sales</p>
          <p>Unsettled Sales: {totalUnsettled}</p>
        </div>
        <div className="bg-yellow-700 h-28 w-64 flex flex-col pl-16 justify-center text-white p-1 rounded-lg">
          <p>Total Workers</p>
          <p>Users: {users.length}</p>
        </div>
      </div>
      <div className="flex flex-row items-center mt-7 gap-5">
        <button
          className={`p-1 rounded-lg text-white w-20 ${
            activeButton === "Sales" ? "greenbg" : "bg-gray-500"
          }`}
          onClick={handleShowSales}
        >
          Sales
        </button>
        <button
          className={`p-1 rounded-lg text-white w-20 ${
            activeButton === "Expenses" ? "greenbg" : "bg-gray-500"
          }`}
          onClick={handleShowExpenses}
        >
          Expenses
        </button>
        <button
          className={`p-1 rounded-lg text-white w-20 ${
            activeButton === "All" ? "greenbg" : "bg-gray-500"
          }`}
          onClick={handleShowAll}
        >
          All
        </button>
      </div>
      {/* Displaying Line Chart */}
      {currentChartData.length > 0 && (
        <div className="flex flex-row gap-10">
          <div className="w-2/3">
            {activeButton === "All" ? (
              <LineChart
                series={[
                  { data: currentChartData[0], label: "Sales", color: "green" },
                  {
                    data: currentChartData[1],
                    label: "Expenses",
                    color: "red",
                  },
                ]}
                xAxis={[
                  {
                    scaleType: "band",
                    data: [
                      "Jan",
                      "Feb",
                      "Mar",
                      "Apr",
                      "May",
                      "Jun",
                      "Jul",
                      "Aug",
                      "Sep",
                      "Oct",
                      "Nov",
                      "Dec",
                    ],
                  },
                ]}
              />
            ) : (
              <LineChart
                series={[
                  {
                    data: currentChartData,
                    label: currentChartLabel,
                    color: "green",
                  },
                ]}
                xAxis={[
                  {
                    scaleType: "band",
                    data: [
                      "Jan",
                      "Feb",
                      "Mar",
                      "Apr",
                      "May",
                      "Jun",
                      "Jul",
                      "Aug",
                      "Sep",
                      "Oct",
                      "Nov",
                      "Dec",
                    ],
                  },
                ]}
              />
            )}
          </div>
          <div className="w-1/3">
            <Pie data={preparePieData()} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Main;
