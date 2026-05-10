// 



import React, { useState, useContext } from 'react';
import './LoginPopup.css';
import { assets } from '../../assets/assets';
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";

const LoginPopup = ({ setShowLogin }) => {

  const { setToken } = useContext(StoreContext);

  const [currState, setCurrState] = useState("Login");

  const [data, setData] = useState({
    name: "",
    email: "",
    password: ""
  });

  // input change handler
  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  // submit handler
  const onSubmitHandler = async (event) => {
  event.preventDefault();

  // let url = "http://localhost:4000";
  
   let url = 'https://food-backend-new-tswh.onrender.com';

  let newUrl =
    currState === "Login"
      ? url + "/api/user/login"
      : url + "/api/user/register";

  // ✅ DEBUG ADD
  console.log("SENDING DATA:", data);
  console.log("URL:", newUrl);

  try {
    const response = await axios.post(newUrl, data);

    // ✅ DEBUG ADD
    console.log("RESPONSE:", response.data);

    if (response.data.success) {
      localStorage.setItem("token", response.data.token);
      setToken(response.data.token);

      localStorage.setItem("userId", response.data.user._id);

      alert("Success ✅");
      setShowLogin(false);
    } else {
      alert(response.data.message);
    }
  } catch (error) {
    console.log("ERROR:", error); // ✅ IMPORTANT
    alert("Error");
  }
};
  return (
    <div className='login-popup'>
      <form onSubmit={onSubmitHandler} className="login-popup-container">

        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="" />
        </div>

        <div className="login-popup-inputs">

          {currState === "Sign Up" && (
            <input
              type="text"
              name="name"
              value={data.name}
              onChange={onChangeHandler}
              placeholder='Your name'
              required
            />
          )}

          <input
            type="email"
            name="email"
            value={data.email}
            onChange={onChangeHandler}
            placeholder='Your email'
            required
          />

          <input
            type="password"
            name="password"
            value={data.password}
            onChange={onChangeHandler}
            placeholder='Password'
            required
          />
        </div>

        <button type="submit">
          {currState === "Sign Up" ? "Create account" : "Login"}
        </button>

        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>By continuing, I agree to the terms & privacy policy</p>
        </div>

        {currState === "Login"
          ? <p>Create a new account? <span onClick={() => setCurrState("Sign Up")}>Click here</span></p>
          : <p>Already have an account? <span onClick={() => setCurrState("Login")}>Login here</span></p>
        }

      </form>
    </div>
  );
};

export default LoginPopup;