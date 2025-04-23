// import { JSONRPCResponse } from "json-rpc-2.0";
import { basePath } from "./api/apiENV";
import { v4 as uuidv4 } from "uuid";
import { getProviders, getSession } from "next-auth/react";
// import jwt from "jsonwebtoken";

// ก๊อปมา อย่างเชื่อ ต้องแก้

async function refreshAccessToken() {
    let refresh_token = await localStorage.getItem("AD_refresh_token");
    let refresh_token_iv = await localStorage.getItem("AD_refresh_token_iv");

    const response = await fetch("/api/refreshToken", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            refreshToken: refresh_token,
            iv: refresh_token_iv,
        }),
    });

    if (!response.ok) {
        throw new Error("Failed to refresh token");
    }

    const data = await response.json();
    localStorage.setItem("AD_access_token", data.access_token);
    localStorage.setItem("AD_refresh_token", data.refresh_token);
    return data.accessToken;
}

// Get AD Token
export const getADToken = async () => {
    let access_token = await localStorage.getItem("AD_access_token");

    if (!access_token) return "";

    const decode = jwt.decode(access_token);

    // Check if the token has expired
    if ((decode as any).exp * 1000 < Date.now()) {
        // Handle token expiration, e.g., refresh the token or redirect the user
        access_token = await refreshAccessToken();
    }

    return access_token;
};

// export const fetchJSONRPC = async (url: string, method: string, params: {}) => {
//   const option = { timeout: 300000 };

//   const controller = new AbortController();
//   const id = setTimeout(() => controller.abort(), option.timeout);

//   try {
//     const token = localStorage.getItem("authToken");
//     //const adToken = await getADToken();

//     // if (!adToken) {
//     //   throw new Error("NO SESSION");
//     // }
//     const response = await fetch(url, {
//       method: "POST",
//       headers: {
//         "content-type": "application/json",
//         Authorization: `Bearer ${token}`,
//         // "Azure-AD-Token": adToken,
//         credentials: "omit", // This prevents sending cookies with the request
//       } as any,

//       body: JSON.stringify({
//         jsonrpc: "2.0",
//         id: uuidv4(),
//         method: method,
//         params: params,
//       }),
//       signal: controller.signal,
//     });

//     const data: JSONRPCResponse = await response.json();

//     clearTimeout(id);

//     if (data.error) throw new Error(data.error.message);

//     if ((data as any).new_token?.token) {
//       localStorage.setItem("authToken", (data as any).new_token.token);
//     }

//     return data.result;
//   } catch (e) {
//     if (
//       (e as any).message === "err_authentication" ||
//       (e as any).message === "err_user_inactive" ||
//       (e as any).message === "Invalid Token"
//     ) {
//       localStorage.removeItem("authToken");
//     }
//     throw new Error((e as any).message);
//   }
// };


export const fetchJSONRPC = async (method: string, params: {}) => {

    const option = { timeout: 300000 };
    const controller = new AbortController();

    const urls = process.env.BACKEND_PATH
    // const id = setTimeout(() => controller.abort(), option.timeout);

    // const token = localStorage.getItem("authToken");

    const response = await fetch(`${urls}/api/${method}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        //   Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ method, params }),
        signal: controller.signal,
      });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    return data.result;
};

// export let isHealthOk = false;
// export let lastCheck = Date.now();
// const healthCheckInterval = 60000;

// export const healthCheck = async (): Promise<boolean> => {
//     const option = { timeout: 1500 };

//     const controller = new AbortController();
//     const id = setTimeout(() => controller.abort(), option.timeout);

//     try {
//         const response = await fetch(`${basePath}/health_check`, {
//             method: "POST",
//             headers: {
//                 "content-type": "application/json",
//             },

//             body: JSON.stringify({
//                 jsonrpc: "2.0",
//                 id: uuidv4(),
//                 method: "health_check.util.once",
//             }),
//             signal: controller.signal,
//         });

//         const data: JSONRPCResponse = await response.json();
//         clearTimeout(id);
//         if (data.error) return false;

//         return true;
//     } catch (e) {
//         return false;
//     }
// };

// // New function to set up repeated health checks
// export const setupHealthCheck = (interval: number) => {
//     setInterval(async () => {
//         const isHealthy = await healthCheck();
//         console.log(`Health check completed. Status: ${isHealthy ? "OK" : "FAIL"}`);
//         // You can add additional logic here to act based on the health check status
//     }, interval);
// };

// Setup the health check to run every minute (60000 ms)
// setupHealthCheck(healthCheckInterval);