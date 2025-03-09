import React from "react";
import { useLoading } from "./LoadingContext";

import { LoadingOverlay } from "@mantine/core";

const LoadingComponent = () => {
  const { isLoading, loadingMessage } = useLoading();

  console.log("isLoading:" + isLoading);

  if (!isLoading) return null;

  return (
    <div style={{width: "100%", height: "100%", position: "fixed",zIndex: "1000"}}>
      <LoadingOverlay visible={isLoading} overlayBlur={2} zIndex={9999}/>
      <div
        style={{
          position: "fixed",
          top: "58%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          color: "#666",
          zIndex: "9999",
          fontSize: "16px",
          fontWeight: "bold",
        }}
      >
        {`${loadingMessage}`}
      </div>
    </div>
  );
};

export default LoadingComponent;
