import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Options from "@/options/Options";
import "@/i18n";
import "@/index.css";
import { ThemeProvider } from "@/context/ThemeProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <Options />
    </ThemeProvider>
  </StrictMode>
);
