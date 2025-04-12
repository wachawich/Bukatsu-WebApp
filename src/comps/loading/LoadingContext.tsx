// import { useRouter } from "next/router";
// import React, { createContext, useContext, useState, useEffect } from "react";

// type LoadingContextType = {
//   isLoading: boolean;
//   showLoading: (message?: string) => void;
//   hideLoading: () => void;
//   loadingMessage: string;
//   setLoadingMessage: (message: string) => void;
// };

// // Update the context to use the new type
// const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

// export const useLoading = (message?: string) => {
//   const context = useContext(LoadingContext);
//   if (!context) {
//     throw new Error("useLoading must be used within a LoadingProvider");
//   }

//   return context;
// };

// export const LoadingProvider: React.FC = ({ children }: any) => {
//   const [isLoading, setLoading] = useState(false);
//   const [loadingMessage, setLoadingMessage] = useState("Loading");

//   const router = useRouter();
//   const [pathName, setLastPathName] = useState<string>("");
// //   const { t } = useTranslation();

//   useEffect(() => {
//     if (router.pathname !== pathName) {
//       setLastPathName(router.pathname);
//       console.log("router.pathname", router.pathname);
//       // setLoading(false);
//     }
//   }, [router.isReady, router.pathname]);
//   // Before
//   // const showLoading = () => setLoading(true)
//   const showLoading = (message?: string) => {
//     if (message) setLoadingMessage(message);
//     if (!message) setLoadingMessage("");
//     setLoading(true);
//   };

//   const hideLoading = () => {
//     setLoading(false);
//   };

//   useEffect(() => {
//     let timeout: NodeJS.Timeout;

//     if (isLoading) {
//       timeout = setTimeout(() => {
//         window.alert("timeout");
//         hideLoading();
//       }, 20000); // 20 seconds
//     }

//     return () => {
//       clearTimeout(timeout);
//     };
//   }, [isLoading]);

//   // Provide all necessary values to the context
//   const value = {
//     isLoading,
//     showLoading,
//     hideLoading,
//     loadingMessage,
//     setLoadingMessage,
//   };

//   return (
//     <div className=".no-interaction">
//       <LoadingContext.Provider value={value}>
//         {children}
//       </LoadingContext.Provider>
//     </div>
//   );
// };

