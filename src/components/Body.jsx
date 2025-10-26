import { useNavigate, Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import Footer from "./Footer";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useEffect } from "react";

const Body = () => {

  // to save data in redux manually so that user do not log out after refresh
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((store) => store.user);
  const fetchUser = async () => {
    if (userData) return;  // if data available in redux store than do not call the api
    try {
      const res = await axios.get(BASE_URL + "/profile/view", {
        withCredentials: true
      });
      dispatch(addUser(res.data));  // update the redux store
    } catch (err) {
      if(err.status === 401 ) {
        navigate("/login");
      }
      console.log("Error: ", err);
    }
  };

  useEffect(() => {
      fetchUser();
  }, []); // call the function every time the component refresh

  return (
    <div>
      <NavBar />
      {/* Yeh outlet children ko render karega (Login / Profile) */}
      <Outlet />
      <Footer />
    </div>
  );
};

export default Body;
