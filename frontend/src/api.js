import axios from "axios";

const API = (process.env.REACT_APP_API_URL || "").replace(/\/$/, "");

axios.defaults.baseURL = API;

export const apiUrl = (path) => `${API}${path}`;

export default API;
