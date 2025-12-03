import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "@/context/ThemeContext";

createRoot(document.getElementById("root")!).render(
    <HelmetProvider>
        <ThemeProvider>
            <App />
        </ThemeProvider>
    </HelmetProvider>
);
