// let IS_PROD = process.env.NODE_ENV === "production";
// const server = IS_PROD ?
//     process.env.VITE_APP_PROD_SERVER_URL :
//     "http://localhost:8000";

let IS_PROD = true;
const server = IS_PROD ?
    "https://meetconnectbackend.onrender.com" :
    "http://localhost:8000";

export default server;