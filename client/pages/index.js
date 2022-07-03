import Login from "../components/Login";
import { useState } from "react";
import axios from "../helpers/axios";
import Cookies from "js-cookie";
import { privateAxios } from "../helpers/axios";
import jwt_decode from "jwt-decode";
import dayjs from "dayjs";

export default function Home() {
  const [user, setUser] = useState({});
  const [secret, setSecret] = useState("");

  const refresh = () => {
    axios
      .get(`refresh?refreshToken=${Cookies.get("refreshToken")}`)
      .then((response) => {
        Cookies.set("accessToken", response.data.accessToken, {
          expires: 1,
        });
        console.log("refreshed token!");
      });
  };

  const getSecret = () => {
    // const options = {
    //   headers: {
    //     Authorization: `Bearer ${Cookies.get("accessToken")}`,
    //     "Content-Type": "application/json",
    //   },
    // };

    const privateInterceptor = privateAxios.interceptors.request.use(
      async (req) => {
        console.log("interceptor ran");

        const accessToken = Cookies.get("accessToken");
        const refreshToken = Cookies.get("refreshToken");

        req.headers.Authorization = `Bearer ${accessToken}`;

        const info = jwt_decode(accessToken);
        const isExpired = dayjs.unix(info.exp).diff(dayjs()) < 1;

        if (!isExpired) return req;

        const response = await axios.get(
          `refresh?refreshToken=${refreshToken}`
        );
        Cookies.set("accessToken", response.data.accessToken, {
          expires: 1,
        });
        console.log("refreshed token!");
        return req;
      },
      (err) => {
        return Promise.reject(err);
      }
    );

    privateAxios.get("/user/me").then((response) => {
      setSecret(response.data);
    });

    axios.interceptors.request.eject(privateInterceptor);
  };

  return (
    <>
      {user.username ? <h3>hello {user.username}</h3> : <h3>logged out</h3>}
      <Login setUser={setUser} />
      <br />
      <button disabled onClick={refresh}>
        refresh
      </button>
      <br />
      <br />
      <button onClick={getSecret}>view private stuff</button>
      <br />
      {secret}
    </>
  );
}
