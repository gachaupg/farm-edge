/* eslint-disable no-unused-vars */
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const Reports = () => {
  const { user } = useSelector((state) => ({ ...state.auth }));
  const [loading1, setLoading1] = useState(false);
  const [pos, setPos] = useState([]);
  const [filteredPos, setFilteredPos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [totalUnsettled, setUnsettled] = useState(0);

  useEffect(() => {
    fetchData();
  }, [user.access, user?.user?.farm]);

  const fetchData = async () => {
    setLoading1(true);
    try {
      const res = await axios.get(
        "https://shamba-new-sever.netlify.app/.netlify/functions/api/pos"
      );
      const filter = res.data.filter(
        (item) => item.farm === user?.user?.farm && item.category === "Store"
      );
      setPos(filter);
      setFilteredPos(filter);

      // Calculate totals
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

  const handleSettle = async (itemId) => {
    try {
      await axios.put(
        `https://shamba-new-sever.netlify.app/.netlify/functions/api/pos/${itemId}`,
        { status: true }
      );
      setPos((prevPos) =>
        prevPos.map((item) =>
          item._id === itemId ? { ...item, category: true } : item
        )
      );
      toast.success("Item settled successfully");
      fetchData();
      setUnsettled((prev) => prev - 1);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // Search filter
  useEffect(() => {
    const filtered = pos.filter((item) =>
      item.item.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPos(filtered);
  }, [searchTerm, pos]);

  return (
    <div className="flex flex-col items-center justify-center">
      {loading1 ? (
        <p>Loading...</p>
      ) : (
        <div
          style={{ width: "85%" }}
          className="flex border border-slate-300 p-4 rounded-lg flex-col mt-6"
        >
          <h2>Settlement Overview</h2>
          <input
            type="text"
            placeholder="Search by item"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 mb-4 rounded"
          />
          <table
            style={{
              border: "1px solid black",
              borderCollapse: "collapse",
              width: "100%",
            }}
            cellPadding="10"
            cellSpacing="0"
          >
            <thead>
              <tr>
                <th style={{ border: "1px solid black" }}>Date</th>
                <th style={{ border: "1px solid black" }}>Item</th>
                <th style={{ border: "1px solid black" }}>Amount</th>
                <th style={{ border: "1px solid black" }}>Quantity</th>
                <th style={{ border: "1px solid black" }}>Type</th>
                <th style={{ border: "1px solid black" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPos.map((item) => (
                <tr key={item._id}>
                  <td style={{ border: "1px solid black" }}>
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ border: "1px solid black" }}>{item.item}</td>
                  <td style={{ border: "1px solid black" }}>{item.amount}</td>
                  <td style={{ border: "1px solid black" }}>{item.quantity}</td>
                  <td style={{ border: "1px solid black" }}>{item.type}</td>
                  <td style={{ border: "1px solid black" }}>
                    {item.status ? (
                      "Settled"
                    ) : (
                      <button
                        className="p-1 border bg-red-700 w-28 rounded-lg text-white"
                        onClick={() => handleSettle(item._id)}
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Reports;
