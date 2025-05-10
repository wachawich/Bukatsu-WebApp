// import jwt from 'jsonwebtoken';

// export const getToken = () => {
//   if (typeof window !== "undefined") {
//     return localStorage.getItem("access_token");
//   }
//   return null;
// };

// export const decodeToken = () => {
//   const token : any = getToken();
//   try {
//     const decoded = jwt.decode(token); 
//     return decoded;
//   } catch (error) {
//     console.error('Invalid token:', error);
//     return null;
//   }
// };

// // example use decode jwt
// // import { decodeToken } from "asdasdaddasd";
// // const tokenData = decodeToken();