// From MUI
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import {
  Button,
  Divider,
  Grid,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";

// Component
import Todo from "./Todo";

// Others
import { v4 as uuidv4 } from "uuid";

// Hooks
import { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";

// Context
import { TodosContext } from "./contexts/todosContext";

// Theme
import { useTheme } from "@mui/material/styles";

export default function TodoList() {
  const { todos, setTodos } = useContext(TodosContext);
  const [titleInput, setTitleInput] = useState("");
  const [todosType, setTodosType] = useState("all");

  const complatedTodos = todos.filter((t) => t.isCompleted);
  const notComplatedTodos = todos.filter((t) => !t.isCompleted);

  let todosToBeRendered = todos;

  if (todosType === "complated") {
    todosToBeRendered = complatedTodos;
  } else if (todosType === "non-complated") {
    todosToBeRendered = notComplatedTodos;
  } else {
    todosToBeRendered = todos;
  }

  const todosJSX = todosToBeRendered.map((todo) => {
    return <Todo key={todo.id} todo={todo} />;
  });

  const changeTypeTodos = (e) => {
    setTodosType(e.target.value);
  };

  // parameter بيقبلها ك praemter useEffect الي ال  array دي في ال state معينه وبحدد ال  state هيا انها بتشتغل لما يحصل تغير ع useEffect مهمة ال
  useEffect(() => {
    setTodos(JSON.parse(localStorage.getItem("todos")) ?? []);
    // component لل load لو سبتها فاضيه الكود هيشتغل اول مره  هيحصل فيها []
    // state الكود هيتشغل في كل مره هيحصل تغير في ال state لو ضيفت فيها
    // عندي state انما لو مكتبتش [] دي اصلا الكود هيشتغل في اول مره يحصل لود وهيشتغل لما يحصل تغيير في اي
  }, []);

  const handleAddClick = () => {
    const newTodo = {
      id: uuidv4(),
      title: titleInput,
      details: "",
      isCompleted: false,
    };

    const updatedTodos = [...todos, newTodo];
    setTodos(updatedTodos);
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
    setTitleInput("");
  };

  return (
    <Container maxWidth="md">
      <Card
        sx={{
          bgcolor: useTheme().palette.primary.light,
          maxHeight: "90vh",
          overflowY: "scroll",
        }}
      >
        <CardContent>
          <Typography variant="h1" sx={{ fontWeight: "500" }}>
            مهامي
          </Typography>
          <Divider />
          {/* Filter Buttons */}
          <ToggleButtonGroup
            color="primary"
            value={todosType}
            exclusive
            onChange={changeTypeTodos}
            aria-label="text alignment"
            sx={{ mt: 7, direction: "ltr" }}
          >
            <ToggleButton value="non-complated">غير منجز</ToggleButton>
            <ToggleButton value="complated">منجز</ToggleButton>
            <ToggleButton value="all">الكل</ToggleButton>
          </ToggleButtonGroup>
          {/* == Filter Buttons == */}
          {/* All Todos */}

          {/* == All Todos == */}
          {todosJSX}
          {/* Input And Add Button */}
          <Grid container sx={{ mt: 1 }} spacing={1}>
            <Grid item xs={10}>
              <TextField
                value={titleInput}
                onChange={(e) => {
                  setTitleInput(e.target.value);
                }}
                fullWidth
                id="outlined-basic"
                label="اكتب مهمتك"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={2}>
              <Button
                onClick={handleAddClick}
                sx={{ width: "100%", height: "100%", fontSize: 22 }}
                size="large"
                variant="contained"
                disabled={!titleInput.trim()}
              >
                اضافة
              </Button>
            </Grid>
          </Grid>

          {/* == Input And Add Button == */}
        </CardContent>
      </Card>
    </Container>
  );
}
