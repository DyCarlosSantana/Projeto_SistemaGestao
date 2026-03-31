import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

window.onerror = function(msg, url, line, col, error) {
  document.body.innerHTML += `<div style="padding: 20px; color: red; background: white; z-index: 9999; position: absolute; top: 0; left: 0; right: 0;"><h2>RUNTIME ERROR</h2><p>${msg}</p><pre>${error?.stack}</pre></div>`;
};

window.onunhandledrejection = function(event) {
  document.body.innerHTML += `<div style="padding: 20px; color: red; background: white; z-index: 9999; position: absolute; top: 0; left: 0; right: 0;"><h2>UNHANDLED PROMISE REJECTION</h2><p>${event.reason}</p></div>`;
};

createRoot(document.getElementById("root")!).render(<App />);
