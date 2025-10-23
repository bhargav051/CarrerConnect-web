import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const Login = () => {
  const [emailId, setEmailId] = useState("mj@gmail.com");
  const [password, setpassword] = useState("Michael@123");
  const dispatch = useDispatch();  // dispatch an action to add data to your redux store
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post(BASE_URL+"/signin", {
        emailId,
        password
      }, { withCredentials: true });  // to fetch the cookies
      console.log(res.data);
      dispatch(addUser(res.data.data));
      return navigate("/");
    } catch (err) {
      console.log("Error : ", err);
    }
  }

  return <div className="flex justify-center my-10">
    <div className="card bg-base-300 w-96 shadow-sm">
      <div className="card-body">
        <h2 className="card-title justify-center">Login</h2>
        <div>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Email ID :</legend>
            <input
              type="text"
              value={emailId}
              className="input"
              onChange={(e) => setEmailId(e.target.value)} />
          </fieldset>
        </div>
        <div>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Password :</legend>
            <input
              type="text"
              value={password}
              className="input"
              onChange={(e) => setpassword(e.target.value)} />
          </fieldset>
        </div>
        <div className="card-actions justify-center">
          <button className="btn btn-primary" onClick={handleLogin}>Login</button>
        </div>
      </div>
    </div>
  </div>;
};

export default Login;
