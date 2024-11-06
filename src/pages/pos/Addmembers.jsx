/* eslint-disable no-unused-vars */
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Addmembers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => ({ ...state.auth }));
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          "https://shamba-new-sever.netlify.app/.netlify/functions/api/auth"
        );
        const filter = res.data.filter((item) => item.farm === "");
        setUsers(filter);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    fetchData();
    // const interval = setInterval(fetchData, 5000);
    // return () => clearInterval(interval);
  }, [navigate]);

  // Filter users based on search term
  useEffect(() => {
    if (searchTerm) {
      const results = users.filter((user) =>
        user.phone.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(results);
    } else {
      setFilteredUsers([]);
    }
  }, [searchTerm, users]);

  return (
    <div className="flex mt-4 ml-20 justify-start flex-col ">
      <p>Seach for members to add</p>
      <input
        className="border border-gray-300 p-2 w-96 rounded-lg"
        type="text"
        placeholder="Search by phone"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {loading && <p>Loading...</p>}
      <div className="mt-10">
        {!loading && filteredUsers.length > 0 && (
          <ul
            style={{
              width: "60%",
            }}
            className="flex flex-col rounded-lg gap-6 border p-2"
          >
            {filteredUsers.map((user) => (
              <>
                <div
                  key={user._id}
                  className="flex flex-row justify-between gap-10"
                >
                  <li>
                    {user.phone} - {user.name}
                    <p>{user.email}</p>
                  </li>
                  <button
                    className="bg-green-500 text-white p-1 w-20 rounded-lg"
                    onClick={() => {
                      navigate("/next", { state: { user } });
                    }}
                  >
                    Next
                  </button>
                </div>
                <p
                  style={{
                    height: "1px",
                  }}
                  className="h-1/2 w-full bg-slate-300"
                ></p>
              </>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Addmembers;
