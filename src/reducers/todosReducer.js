import { v4 as uuidv4 } from "uuid";

export default function reducer(curruntTodos, action) {
  switch (action.type) {
    case "get": {
      return JSON.parse(localStorage.getItem("todos")) ?? [];
    }

    case "added": {
      const newTodo = {
        id: uuidv4(),
        title: action.payload.titleInput,
        details: "",
        isCompleted: false,
        time: `${new Date().getDate()}/${
          new Date().getMonth() + 1
        }/${new Date().getFullYear()} ${
          new Date().getHours() % 12 || 12
        }:${new Date().getMinutes().toString().padStart(2, "0")} ${
          new Date().getHours() >= 12 ? "م" : "ص"
        }`,
        category: "",
      };

      const updatedTodos = [...curruntTodos, newTodo];
      localStorage.setItem("todos", JSON.stringify(updatedTodos));
      return updatedTodos;
    }

    case "edit": {
      const editTodoConfirm = curruntTodos.map((t) => {
        if (t.id === action.payload.id) {
          return {
            ...t,
            title: action.payload.title,
            details: action.payload.details,
          };
        } else {
          return t;
        }
      });
      localStorage.setItem("todos", JSON.stringify(editTodoConfirm));
      return editTodoConfirm;
    }

    case "toggleComplate": {
      const updateTodo = curruntTodos.map((t) => {
        if (t.id === action.payload.id) {
          action.payload.showHideSnackbar(
            `تم اضافة ( ${t.title} ) الي المهام ${
              t.isCompleted ? "الغير منجزه" : "المنجزه"
            }`
          );
          return { ...t, isCompleted: !t.isCompleted };
        }
        return t;
      });
      localStorage.setItem("todos", JSON.stringify(updateTodo));
      return updateTodo;
    }

    case "changeCategory": {
      const editTodoConfirm = curruntTodos.map((t) => {
        if (t.id === action.payload.id) {
          return {
            ...t,
            category: action.payload.name,
          };
        } else {
          return t;
        }
      });
      localStorage.setItem("todos", JSON.stringify(editTodoConfirm));
      return editTodoConfirm;
    }

    case "resetCategory": {
      const resetCategory = curruntTodos.map((t) => {
        if (t.category === action.payload.category) {
          return {
            ...t,
            category: "",
          };
        } else {
          return t;
        }
      });
      localStorage.setItem("todos", JSON.stringify(resetCategory));
      return resetCategory;
    }

    case "deleted": {
      const deleteTodo = curruntTodos.filter((t) => {
        action.payload.showHideSnackbar(`تم حذف ( ${t.title} ) بنجاح`);
        return t.id !== action.payload.id;
      });
      localStorage.setItem("todos", JSON.stringify(deleteTodo));
      return deleteTodo;
    }

    case "deleteAll": {
      localStorage.removeItem("todos");
      return [];
    }

    default: {
      throw Error(action.type + "is not found");
    }
  }
}
