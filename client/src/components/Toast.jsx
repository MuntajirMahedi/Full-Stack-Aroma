import React from "react";

export default function Toast({ message }) {
  if (!message) return null;

  return (
    <div style={{
      position: "fixed",
      top: "15px",
      right: "15px",
      background: "#4c8f20ff",
      color: "#fff",
      padding: "10px 18px",
      borderRadius: "6px",
      fontSize: "14px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      zIndex: 9999,
      animation: "fadeInOut 3s ease forwards"
    }}>
      {message}

      <style>
        {`
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateY(-10px); }
          10% { opacity: 1; transform: translateY(0); }
          90% { opacity: 1; }
          100% { opacity: 0; transform: translateY(-10px); }
        }
        `}
      </style>
    </div>
  );
}
