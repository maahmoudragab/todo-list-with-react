import "./App.css";

// MUI
import { createTheme, ThemeProvider } from "@mui/material";

// Component
import TodoList from "./component/TodoList";

// Hooks
import { useState, useEffect } from "react";

// Context
import TodosProvider from "./contexts/todosContext";
import { SnackbarProvider } from "./contexts/snackbarContext";

function App() {
  const [mode, setMode] = useState(localStorage.getItem("mode") || "light");

  useEffect(() => {
    localStorage.setItem("mode", mode);
  }, [mode]);

  const theme = createTheme({
    typography: {
      fontFamily: ["Alexandria"],
    },
    palette: {
      primary: {
        main: "#009688",
        contrastText: "#000",
      },
      secondary: {
        main: "#36d3e0",
        contrastText: "#000",
      },
      background: {
        default: mode === "light" ? "#e0f2f1" : "#222",
      },
    },

    components: {
      MuiDialog: {
        styleOverrides: {
          root: {
            textAlign: "right",
          },

          paper: {
            backgroundColor: "#00000021",
            backdropFilter: "blur(20px)",
            borderRadius: "15px",
            border: `1px solid #009688`,
          },
        },
      },
      MuiDialogTitle: {
        styleOverrides: {
          root: {
            textAlign: "center",
            color: "#fff",
          },
        },
      },
      MuiDialogContent: {
        styleOverrides: {
          root: {
            color: "#fff",
            padding: "6px 10px",
          },
        },
      },
      MuiDialogActions: {
        styleOverrides: {
          root: {
            justifyContent: "flex-end",
          },
        },
      },
    },
  });

  document.body.style.setProperty(
    "--bg-color",
    theme.palette.background.default
  );

  return (
    <ThemeProvider theme={theme}>
      <TodosProvider>
        <SnackbarProvider>
          <div
            className="App"
            style={{ "--bg-color": theme.palette.primary.light }}
          >
            <TodoList mode={mode} setMode={setMode} />
          </div>
        </SnackbarProvider>
      </TodosProvider>
    </ThemeProvider>
  );
}

export default App;
