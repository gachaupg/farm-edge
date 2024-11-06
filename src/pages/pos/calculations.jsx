/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import jsPDF from "jspdf";
import "jspdf-autotable";
import dayjs from "dayjs"; // Optional: for advanced date formatting

const Calculations = () => {
  const { user } = useSelector((state) => ({ ...state.auth }));
  const [loading1, setLoading1] = useState(false);
  const [filteredPos, setFilteredPos] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [profit, setProfit] = useState(0);

  const formattedDate = dayjs().format("MMMM D, YYYY");

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
        setFilteredPos(filter);

        // Calculate totals for expenses and sales
        const expensesTotal = filter
          .filter((item) => item.category === "Expenses")
          .reduce((sum, item) => sum + item.amount, 0);

        const salesTotal = filter
          .filter((item) => item.category === "Sales")
          .reduce((sum, item) => sum + item.amount, 0);

        // Calculate profit
        setTotalExpenses(expensesTotal);
        setTotalSales(salesTotal);
        setProfit(salesTotal - expensesTotal); // Profit calculation
        setLoading1(false);
      } catch (error) {
        console.log(error);
        setLoading1(false);
      }
    };
    fetchData();
  }, [user.access, user.user.farm]);

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Monthly Sales & Expenses Report", 20, 20);
    doc.setFontSize(12);
    doc.text(`Date: ${formattedDate}`, 20, 30);

    const tableColumn = ["Item Name", "Amount"];
    const tableRows = [];

    filteredPos
      .filter(
        (item) => item.category === "Sales" || item.category === "Expenses"
      )
      .forEach((item) => {
        const rowData = [item.item, `$${item.amount.toFixed(2)}`];
        tableRows.push(rowData);
      });

    doc.autoTable({
      startY: 40,
      head: [tableColumn],
      body: tableRows,
    });

    doc.text(
      `Total Sales: $${totalSales.toFixed(2)}`,
      20,
      doc.lastAutoTable.finalY + 10
    );
    doc.text(
      `Total Expenses: $${totalExpenses.toFixed(2)}`,
      20,
      doc.lastAutoTable.finalY + 20
    );
    doc.text(
      `Profit: $${profit.toFixed(2)}`,
      20,
      doc.lastAutoTable.finalY + 30
    );

    doc.save(`Sales_Expenses_Report_${formattedDate}.pdf`);
  };

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        maxWidth: "600px",
        margin: "auto",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "8px",
      }}
    >
      <h2 style={{ textAlign: "center" }}>Monthly Sales & Expenses Report</h2>

      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <p>
          <strong>Date:</strong> {formattedDate}
        </p>
      </div>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "20px",
        }}
      >
        <thead>
          <tr>
            <th
              style={{
                borderBottom: "1px solid #ddd",
                padding: "8px",
                textAlign: "left",
              }}
            >
              Item Name
            </th>
            <th
              style={{
                borderBottom: "1px solid #ddd",
                padding: "8px",
                textAlign: "right",
              }}
            >
              Amount
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredPos
            .filter(
              (item) =>
                item.category === "Sales" || item.category === "Expenses"
            )
            .map((item, index) => (
              <tr key={index}>
                <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
                  {item.item}
                </td>
                <td
                  style={{
                    padding: "8px",
                    textAlign: "right",
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  ${item.amount.toFixed(2)}
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      <div style={{ textAlign: "right", marginBottom: "20px" }}>
        <p>
          <strong>Total Sales:</strong> ${totalSales.toFixed(2)}
        </p>
        <p>
          <strong>Total Expenses:</strong> ${totalExpenses.toFixed(2)}
        </p>
        <p>
          <strong>Profit:</strong> ${profit.toFixed(2)}
        </p>
      </div>

      <div
        className="flex flex-row items-center justify-between"
        style={{
          display: "flex",
          textAlign: "center",
          marginTop: "20px",
          fontStyle: "italic",
        }}
      >
        <p>Generated on {formattedDate}</p>
        <button
          className="p-1"
          onClick={downloadPDF}
          style={{
            backgroundColor: "#4CAF50",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default Calculations;
