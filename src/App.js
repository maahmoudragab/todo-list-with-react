import "./App.css";

// From MUI
import { createTheme, ThemeProvider } from "@mui/material";

// Component
import TodoList from "./component/TodoList";

// Hooks
import { useState } from "react";

// Context
import { TodosContext } from "./component/contexts/todosContext";

// Others
import { v4 as uuidv4 } from "uuid";

const theme = createTheme({
  typography: {
    fontFamily: ["Alexandria"],
  },
  palette: {
    primary: {
      main: "#009688",
      light: "#e0f2f1",
      dark:"#00695c"
    }
  }
});
const initTodos = [
  {
    id: uuidv4(),
    title: "قراءه كتاب",
    details: "sasdafsdfsddf",
    isCompleted: false,
  },
  {
    id: uuidv4(),
    title: "قراءه كتاب",
    details: "محمود false يسطا",
    isCompleted: false,
  },
  {
    id: uuidv4(),
    title: "قراءه كتاب",
    details: "true المهمه دي",
    isComolated: true,
  },
];

function App() {
  const [todos, setTodos] = useState(initTodos);
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <TodosContext.Provider value={{ todos, setTodos }}>
          <TodoList />
        </TodosContext.Provider>
      </div>
    </ThemeProvider>
  );
}

export default App;
