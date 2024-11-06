/* eslint-disable no-unused-vars */
import { Update } from "@mui/icons-material";
import axios from "axios";
import { Delete, Pen, Trash } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Modal, Box, TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Settlement = () => {
  const { user } = useSelector((state) => ({ ...state.auth }));
  const [loading1, setLoading1] = useState(false);
  const navigate = useNavigate();
  const [pos, setPos] = useState([]);
  const [filteredPos, setFilteredPos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [totalUnsettled, setUnsettled] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [updatedItem, setUpdatedItem] = useState({
    item: "",
    amount: "",
    quantity: "",
  });

  useEffect(() => {
    fetchData();
  }, [user.access, user?.user?.farm]);

  const fetchData = async () => {
    setLoading1(true);
    try {
      const res = await axios.get(
        "https://shamba-new-sever.netlify.app/.netlify/functions/api/pos"
      );
      const filter = res.data.filter((item) => item.farm === user?.user?.farm);
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
          item._id === itemId ? { ...item, status: true } : item
        )
      );
      toast.success("Item settled successfully");
      fetchData();
      setUnsettled((prev) => prev - 1);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleDelete = async (itemId) => {
    try {
      await axios.delete(
        `https://shamba-new-sever.netlify.app/.netlify/functions/api/pos/${itemId}`
      );
      setPos((prevPos) => prevPos.filter((item) => item._id !== itemId));
      toast.success("Item deleted successfully");
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const openUpdateModal = (item) => {
    setCurrentItem(item);
    setUpdatedItem({
      item: item.item,
      amount: item.amount,
      quantity: item.quantity,
    });
    setOpenModal(true);
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `https://shamba-new-sever.netlify.app/.netlify/functions/api/pos/${currentItem._id}`,
        updatedItem
      );
      setPos((prevPos) =>
        prevPos.map((item) =>
          item._id === currentItem._id ? { ...item, ...updatedItem } : item
        )
      );
      toast.success("Item updated successfully");
      setOpenModal(false);
      fetchData();
    } catch (error) {
      console.error("Error updating item:", error);
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
    <div className="flex flex-col ml-10">
      <div className="flex gap-2">
        <button
          onClick={() => navigate("/calculations")}
          className="border greenbg p-1 white rounded-lg"
        >
          Reports & Calculations
        </button>
        <button className="greybg p-1 rounded-lg w-24 white">Inventory</button>
      </div>
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
                    <div className="flex items-center gap-3">
                      <Pen
                        className="green"
                        onClick={() => openUpdateModal(item)}
                      />
                      <Trash
                        className="text-red-500"
                        onClick={() => handleDelete(item._id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <h3>Totals</h3>
          <p>Total Expenses: {totalExpenses}</p>
          <p>Total Sales: {totalSales}</p>
          <p>Unsettled Sales: {totalUnsettled}</p>
        </div>
      )}

      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <h2>Edit Item</h2>
          <TextField
            label="Item"
            value={updatedItem.item}
            onChange={(e) =>
              setUpdatedItem({ ...updatedItem, item: e.target.value })
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="Amount"
            value={updatedItem.amount}
            onChange={(e) =>
              setUpdatedItem({ ...updatedItem, amount: e.target.value })
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="Quantity"
            value={updatedItem.quantity}
            onChange={(e) =>
              setUpdatedItem({ ...updatedItem, quantity: e.target.value })
            }
            fullWidth
            margin="normal"
          />
          <Button onClick={handleUpdate} variant="contained" color="primary">
            Update
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default Settlement;
