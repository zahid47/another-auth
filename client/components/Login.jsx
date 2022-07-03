import axios from "../helpers/axios";
import Cookies from "js-cookie";
import { useState } from "react";

export default function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    const user = {
      email: email,
      password: password,
    };

    axios
      .post("/auth/login", user)
      .then((response) => {
        Cookies.set("accessToken", response.data.accessToken, {
          expires: 1,
        });
        Cookies.set("refreshToken", response.data.refreshToken, {
          expires: 1,
        });
        setUser(response.data.user);
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  };

  return (
    <div>
      <form>
        <label>Email: </label>
        <input type="email" onChange={(e) => setEmail(e.target.value)} />

        <label>Password: </label>
        <input type="password" onChange={(e) => setPassword(e.target.value)} />

        <button onClick={handleLogin}>Log In</button>
      </form>
    </div>
  );
}
