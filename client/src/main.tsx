import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { NotesProvider } from "./context/NotesContext";

createRoot(document.getElementById("root")!).render(
  <NotesProvider>
    <App />
  </NotesProvider>
);
