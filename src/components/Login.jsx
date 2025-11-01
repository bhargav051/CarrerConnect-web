import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const Login = () => {
  const [emailId, setEmailId] = useState("");
  const [password, setpassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoginForm, setLoginForm] = useState(true);
  const [error, setError] = useState("");
  const dispatch = useDispatch();  // dispatch an action to add data to your redux store
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post(BASE_URL + "/signin", {
        emailId,
        password
      }, { withCredentials: true });  // to fetch the cookies
      dispatch(addUser(res.data.data));
      return navigate("/");
    } catch (err) {
      setError(err?.response?.data || "Something went wrong !!");
    }
  }

  const handleSignup = async () => {
    try {
      const res = await axios.post(BASE_URL + "/signup", {
        emailId,
        password,
        firstName,
        lastName
      }, { withCredentials: true });  // to fetch the cookies
      console.log("Signup successful: ", res);
      dispatch(addUser(res.data.data));
      return navigate("/profile");
    } catch (err) {
      setError(err?.response?.data || "Something went wrong !!");
    }
  }

  return <div className="flex justify-center my-10">
    <div className="card bg-base-300 w-96 shadow-sm">
      <div className="card-body">
        <h2 className="card-title justify-center">{isLoginForm ? "Login" : "Signup"}</h2>
        {!isLoginForm && <>
          <div>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">First Name :</legend>
              <input
                type="text"
                value={firstName}
                className="input"
                onChange={(e) => setFirstName(e.target.value)} />
            </fieldset>
          </div>
          <div>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Last Name :</legend>
              <input
                type="text"
                value={lastName}
                className="input"
                onChange={(e) => setLastName(e.target.value)} />
            </fieldset>
          </div>
        </>}
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
              type="password"
              value={password}
              className="input"
              onChange={(e) => setpassword(e.target.value)} />
          </fieldset>
        </div>
        <p className="text-red-500">{error}</p>
        <div className="card-actions justify-center">
          <button className="btn btn-primary" onClick={isLoginForm ? handleLogin : handleSignup}>{isLoginForm ? "Login" : "Signup"}</button>
        </div>
        <p className="text-center py-3">{isLoginForm ? "Don't have an account?" : "Already have an account?"}<span className="link" onClick={() => setLoginForm(!isLoginForm)}>{isLoginForm ? " Signup" : " Login"}</span></p>
      </div>
    </div>
  </div >
};

export default Login;
