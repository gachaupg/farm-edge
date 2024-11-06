import { LogOut } from "lucide-react";
import { setLogout } from "../redux/features/authSlice";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const Topbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <div className="flex items-center navbar justify-between p-4 bg-white  fixed w-full h-16">
      <p className="green font-bold">FarmEdge</p>
      <div className="text-gray-800 font-semibold">
        <button
          onClick={() => {
            dispatch(setLogout(null));
            toast.warning("Logged out!", {
              position: "top-right",
            });
            navigate("/login");
          }}
          className="flex flex-row items-center gap-1 border p-1 w-24 rounded-lg text-white greenbg"
        >
        Logout <LogOut />
        </button>
      </div>
    </div>
  );
};

export default Topbar;
