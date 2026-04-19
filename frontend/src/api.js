const API = process.env.REACT_APP_API_URL || "";

export const apiUrl = (path) => `${API}${path}`;

export default API;
