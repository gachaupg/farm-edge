import  { useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const RoleManagement = () => {
  const { user } = useSelector((state) => ({ ...state.auth }));
  const location = useLocation();
  const user1 = location.state.user;
  console.log("user", user1);
  const navigate = useNavigate();
  const [roles, setRoles] = useState({
    canRecordSales: false,
    canRecordExpenses: false,
    canManageWorkers: false,
    canViewReports: false,
    canManageStores: false,
    canManageInventory: false,
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleRoleChange = (role) => {
    setRoles((prevRoles) => ({
      ...prevRoles,
      [role]: !prevRoles[role],
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    setSuccess(false);

    const requestBody = {
      can_record_sales: roles.canRecordSales,
      can_record_expenses: roles.canRecordExpenses,
      can_manage_workers: roles.canManageWorkers,
      can_view_reports: roles.canViewReports,
      can_manage_stores: roles.canManageStores,
      can_manage_inventory: roles.canManageInventory,
      farm: user?.user?.farm,
      farm_id: user1.farm, // Assuming `farm_id` is from `user1`
    };

    try {
      const response = await fetch(
        `https://shamba-new-sever.netlify.app/.netlify/functions/api/auth/${user1._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );
      console.log("response", response);

      if (response.ok) {
        setSuccess(true);
        toast.success("Data updated successfully!");
        navigate('/')
      } else {
        console.error("Error saving data");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Manage Roles</h2>
      <div style={styles.roleContainer}>
        {Object.keys(roles).map((role) => (
          <div key={role} style={styles.roleItem}>
            <label>
              <input
                type="checkbox"
                checked={roles[role]}
                onChange={() => handleRoleChange(role)}
              />
              {role
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase())}
            </label>
          </div>
        ))}
      </div>
      <button onClick={handleSave} style={styles.button}>
        {loading ? "Saving..." : "Save Data"}
      </button>
      {success && (
        <p style={styles.successMessage}>Data updated successfully!</p>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    border: "1px solid #ddd",
    padding: "20px",
    borderRadius: "8px",
    maxWidth: "400px",
    margin: "0 auto",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  heading: {
    fontSize: "24px",
    marginBottom: "20px",
  },
  roleContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    width: "100%",
  },
  roleItem: {
    border: "1px solid #ccc",
    borderRadius: "4px",
    padding: "10px",
    display: "flex",
    alignItems: "center",
  },
  button: {
    marginTop: "20px",
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
  },
  successMessage: {
    marginTop: "10px",
    color: "#28a745",
    fontWeight: "bold",
  },
};

export default RoleManagement;
