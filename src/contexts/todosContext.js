import { createContext, useReducer, useEffect, useContext, useState } from "react";
import reducer from "../reducers/todosReducer.js";

const TodosContext = createContext();
const dispatchContext = createContext();

const TodosProvider = ({ children }) => {
  const [todos, dispatch] = useReducer(reducer, []);
  const [categories, setCategories] = useState(JSON.parse(localStorage.getItem("categories")) || []);

  useEffect(() => {
    localStorage.setItem("categories", JSON.stringify(categories));
  }, [categories]);

  return (
    <TodosContext.Provider value={{ todos, setCategories, categories }}>
      <dispatchContext.Provider value={dispatch}>
        {children}
      </dispatchContext.Provider>
    </TodosContext.Provider>
  );
};

export const useTodos = () => useContext(TodosContext).todos;
export const useCategories = () => useContext(TodosContext).categories;
export const useSetCategories = () => useContext(TodosContext).setCategories;
export const useDispatch = () => useContext(dispatchContext);

export default TodosProvider;
