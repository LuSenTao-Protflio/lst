import React from "react";
import ReactDOM from "react-dom/client";
import { MotionConfig } from "framer-motion";
import "@fontsource/manrope/400.css";
import "@fontsource/manrope/500.css";
import "@fontsource/manrope/600.css";
import "@fontsource/manrope/700.css";
import "@fontsource/manrope/800.css";
import App from "./App";
import { LanguageProvider } from "./i18n";
import { FORCE_FULL_MOTION } from "./config/motion";
import "./styles.css";

const redirect = new URLSearchParams(window.location.search).get("redirect");
if (redirect) {
  window.history.replaceState(null, "", `${import.meta.env.BASE_URL}${redirect}`);
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <MotionConfig reducedMotion={FORCE_FULL_MOTION ? "never" : "user"}>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </MotionConfig>
  </React.StrictMode>,
);
