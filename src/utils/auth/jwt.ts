import * as jwtDecode from "jwt-decode";  
import jwt from 'jsonwebtoken';

export const getToken = (): string | null => {
  if (typeof window !== "undefined") {
    const raw = localStorage.getItem("bukatsu_access_token");
    if (raw) {
      try {
        const { token, expiresAt } = JSON.parse(raw);
        if (!expiresAt || Date.now() < expiresAt) {
          return token;
        } else {
          localStorage.removeItem("bukatsu_access_token"); // หมดอายุแล้ว ลบทิ้ง
        }
      } catch (e) {
        console.error("Failed to parse token:", e);
        localStorage.removeItem("bukatsu_access_token");
      }
    }
  }
  return null;
};


export const decodeToken = (): any => {
  const token = getToken();
  if (!token) return null;

  try {
    const decoded = jwt.decode(token); // หรือ jwtDecode(token) ถ้าใช้ 'jwt-decode'
    return decoded;
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};


// example use decode jwt
// import { decodeToken } from "@/utils/auth/jwt";
// const tokenData = decodeToken();