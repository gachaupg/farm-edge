import React, { useEffect } from "react";
import PropTypes from "prop-types";
import {
  Routes,
  Route,
  useNavigate,
  Link,
  useLocation,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import InventoryIcon from "@mui/icons-material/Inventory";
import ReportIcon from "@mui/icons-material/Assessment";
import GroupIcon from "@mui/icons-material/Group";
import LogoutIcon from "@mui/icons-material/Logout";
import { toast, ToastContainer } from "react-toastify";
import { setLogout } from "./redux/features/authSlice";
import Login from "./pages/Auth/Login";
import Home from "./pages/Home";
import Sales from "./pages/pos/Sales";
import "react-toastify/dist/ReactToastify.css";
import Expenses from "./pages/pos/Expenses";
import Inventory from "./pages/pos/inventory";
import Settlement from "./pages/pos/Settlement";
import Reports from "./pages/pos/reports";
import Addmembers from "./pages/pos/Addmembers";
import Next from "./pages/pos/Next";
import Calculations from "./pages/pos/calculations";
import { Avatar } from "@mui/material";
import Records from "./pages/pos/Records";
const drawerWidth = 240;

function ResponsiveDrawer(props) {
  const { user } = useSelector((state) => ({ ...state.auth }));
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user === null) {
      navigate("/login");
    }
  }, [navigate, user]);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawerItems = [
    { text: "Dashboard", path: "/", icon: <DashboardIcon /> },
    { text: "Record Sales", path: "/sales", icon: <AttachMoneyIcon /> },
    {
      text: "Record Expenses",
      path: "/record expenses",
      icon: <AttachMoneyIcon />,
    },
    {
      text: "Manage Inventory",
      path: "/manage inventory",
      icon: <InventoryIcon />,
    },
    {
      text: "Sales Settlement",
      path: "/sales settlement",
      icon: <AttachMoneyIcon />,
    },
    { text: "View Reports", path: "/view reports", icon: <ReportIcon /> },
    { text: "Add Workers", path: "/add workers", icon: <GroupIcon /> },
  ];

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {drawerItems.map(({ text, path, icon }) => (
          <ListItem key={text} disablePadding>
            <Link to={path} className="flex items-center gap-2 w-full">
              <ListItemButton
                selected={location.pathname === path}
                sx={{
                  backgroundColor:
                    location.pathname === path ? "grey.300" : "transparent",
                  borderRadius: 2,
                  "&.Mui-selected": {
                    "&:hover": { backgroundColor: "grey.400" },
                  },
                }}
              >
                <ListItemIcon>{icon}</ListItemIcon>
                {mobileOpen && <ListItemText primary={text} />}
              </ListItemButton>
            </Link>
          </ListItem>
        ))}
        <button
          onClick={() => {
            dispatch(setLogout(null));
            toast.warning("Logged out!", { position: "top-right" });
            navigate("/login");
          }}
          className="flex justify-center w-64 ml-3 items-center gap-1 border p-1 rounded-lg text-white greenbg"
        >
          Logout <LogoutIcon />
        </button>
      </List>
      <Divider />
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      {user && (
        <>
          <AppBar
            className="nav"
            position="fixed"
            elevation={0}
            sx={{
              width: {
                sm: `calc(100% - ${mobileOpen ? drawerWidth : 64}px)`,
              },
              ml: { sm: `${mobileOpen ? drawerWidth : 64}px` },
              borderBottom: "1px solid #ccc", // Add border for separation
            }}
          >
            <div
              className="items"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center", // Center vertically
                padding: "0 16px", // Add padding for spacing
              }}
            >
              <div className="flex items-center gap-2">
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ mr: 2 }}
                >
                  <MenuIcon className="icon" />
                </IconButton>
                <Link to="/" className="flex items-center gap-2">
                  <p
                    className="font-bold ml-1 mt-2 text"
                    style={{ fontSize: "1.5rem" }}
                  >
                    <span className="text text-green-500">Farm</span>
                    <span className="text text-orange-500">Edge</span>
                  </p>
                </Link>
              </div>
              <div className="flex flex-row items-center gap-2">
                <Link to="/account">
                  <Avatar className="h-10" />
                </Link>
                <button
                  onClick={() => {
                    dispatch(setLogout(null));
                    toast.warning("Logged out!", { position: "top-right" });
                    navigate("/login");
                  }}
                >
                  Logout
                </button>
              </div>
            </div>
          </AppBar>
        </>
      )}

      {user && (
        <>
          <Box
            component="nav"
            sx={{
              width: { sm: mobileOpen ? drawerWidth : 64 },
              flexShrink: { sm: 0 },
            }}
            aria-label="mailbox folders"
          >
            <Drawer
              container={container}
              variant="temporary"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              ModalProps={{ keepMounted: true }}
              sx={{
                display: { xs: "block", sm: "none" },
                "& .MuiDrawer-paper": { width: mobileOpen ? drawerWidth : 64 },
              }}
            >
              {drawer}
            </Drawer>

            <Drawer
              variant="permanent"
              open
              sx={{
                display: { xs: "none", sm: "block" },
                "& .MuiDrawer-paper": { width: mobileOpen ? drawerWidth : 64 },
              }}
            >
              {drawer}
            </Drawer>
          </Box>
        </>
      )}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: "100%",
          height: "100vh",
          overflowY: "auto",
        }}
      >
        <Toolbar />
        <ToastContainer />

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/record expenses" element={<Expenses />} />
          <Route path="/manage inventory" element={<Inventory />} />
          <Route path="/sales settlement" element={<Settlement />} />
          <Route path="/view reports" element={<Reports />} />
          <Route path="/add workers" element={<Addmembers />} />
          <Route path="/next" element={<Next />} />
          <Route path="/calculations" element={<Calculations />} />
          <Route path="/records" element={<Records />} />
          <Route path="*" element={<h1>Not Found</h1>} />
        </Routes>
      </Box>
    </Box>
  );
}

ResponsiveDrawer.propTypes = {
  window: PropTypes.func,
};

export default ResponsiveDrawer;
