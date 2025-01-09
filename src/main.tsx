import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "@/context/ThemeProvider";
import Popup from "@/popup/Popup";
import "@/i18n";
import "@/index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <Popup />
    </ThemeProvider>
  </React.StrictMode>
);
