import { createContext, useState, useContext } from "react";
import MySnackbar from "../component/MySnackbar";

const SnackbarContext = createContext();

export const SnackbarProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  function showHideSnackbar(message) {
    setMessage(message);
    setOpen(true);
    setTimeout(() => {
      setOpen(false);
    }, 3000);
  }
  return (
    <SnackbarContext.Provider value={{ showHideSnackbar }}>
      <MySnackbar open={open} message={message} />
      {children}
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => useContext(SnackbarContext);
