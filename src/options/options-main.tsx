import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Options from "@/options/Options";
import "@/i18n";
import "@/index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Options />
  </StrictMode>
);
