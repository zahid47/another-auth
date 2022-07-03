import axios from "axios";
import Cookies from "js-cookie";
const baseURL = "http://localhost:8000/api/v1";

export default axios.create({
  baseURL,
});

export const privateAxios = axios.create({
  baseURL,
});

// // Add a request interceptor
// privateAxios.interceptors.request.use(
//   function (config) {
//     // Do something before request is sent
//     return config;
//   },
//   function (error) {
//     // Do something with request error
//     return Promise.reject(error);
//   }
// );

// // Add a response interceptor
// privateAxios.interceptors.response.use(
//   function (response) {
//     // Any status code that lie within the range of 2xx cause this function to trigger
//     // Do something with response data
//     return response;
//   },
//   function (error) {
//     // Any status codes that falls outside the range of 2xx cause this function to trigger
//     // Do something with response error
//     return Promise.reject(error);
//   }
// );
