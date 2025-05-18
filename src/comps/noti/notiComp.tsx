import React, { createContext, useContext, useState } from "react";

interface NotificationProps {
  title: string;
  message: string;
  response: "success" | "error";
}

interface NotificationContextType {
  showNotification: (title: string, message: string, response: "success" | "error") => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notificationProps, setNotificationProps] = useState<NotificationProps | null>(null);
  const [show, setShow] = useState(false);

  const showNotification = (title: string, message: string, response: "success" | "error") => {
    setNotificationProps({ title, message, response });
    setShow(true);
    setTimeout(() => setShow(false), 3000); // Auto close after 10 seconds
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {show && notificationProps && (
        <div
          style={{
            backgroundColor: notificationProps.response === "success" ? "#2F9E44" : "#E03131",
            color: "white",
            padding: "20px",
            position: "fixed",
            top: "7rem",
            left: "50%",
            transform: "translateX(-50%)",
            width: "90%",
            borderRadius: "8px",
            zIndex: 999999,
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            maxWidth: "30rem"
          }}
        >
          <div style={{ fontWeight: "bold", fontSize: "18px" }}>{notificationProps.title}</div>
          <div style={{ fontSize: "16px" }}>{notificationProps.message}</div>
        </div>
      )}
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
};
