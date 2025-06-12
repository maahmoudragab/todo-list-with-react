// MUI Compontents:
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Divider,
  Grid,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Collapse,
  IconButton,
  Stack,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { TransitionGroup } from "react-transition-group";

// MUI Icons:
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import SettingsIcon from "@mui/icons-material/Settings";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";

// Import Theme Hook
import { useTheme } from "@mui/material/styles";

// Import React Hooks
import { useState, useEffect, useMemo } from "react";

// Custom Compontents
import Todo from "./Todo";

// Import Contexts
import { useSnackbar } from "../contexts/snackbarContext";
import {
  useTodos,
  useDispatch,
  useCategories,
  useSetCategories,
} from "../contexts/todosContext";

export default function TodoList({ mode, setMode }) {
  const theme = useTheme();
  const todos = useTodos();
  const dispatch = useDispatch();
  const categories = useCategories();
  const setCategories = useSetCategories();
  const { showHideSnackbar } = useSnackbar();

  const [titleInput, setTitleInput] = useState("");
  const [categoryInput, setCategoryInput] = useState("");

  const [todosType, setTodosType] = useState("all");
  const [todosToBeRendered, setTodosToBeRendered] = useState(todos);
  const [dialogTodo, setDialogTodo] = useState(null);

  // Dialogs States
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [openSettingDialog, setOpenSettingDialog] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedTodos = JSON.parse(localStorage.getItem("todos")) || [];
      dispatch({ type: "get", payload: storedTodos });
    }
  }, []);

  useEffect(() => {
    setCategories(JSON.parse(localStorage.getItem("categories")));
  }, []);

  const [complatedTodos, notComplatedTodos] = useMemo(() => {
    const complated = todos.filter((t) => t.isCompleted);
    const notComplated = todos.filter((t) => !t.isCompleted);
    return [complated, notComplated];
  }, [todos]);

  useEffect(() => {
    const updatedTodos =
      todosType === "complated"
        ? complatedTodos
        : todosType === "non-complated"
        ? notComplatedTodos
        : categories.includes(todosType)
        ? todos.filter((t) => t.category === todosType)
        : todos;

    setTodosToBeRendered(updatedTodos);
  }, [todosType, todos, categories, complatedTodos, notComplatedTodos]);

  const changeModeClicked = (e) => {
    setMode(e.target.value);
    localStorage.setItem("mode", e.target.value);
  };

  const clickedCategory = (c) => setTodosType(c);

  const changeTypeTodos = (e) => setTodosType(e.target.value);

  // HANDLE ADD NEW TODO
  const handleAddClick = () => {
    dispatch({ type: "added", payload: { titleInput } });
    setTitleInput("");
    showHideSnackbar(`تم اضافة ( ${titleInput} ) بنجاح`);
  };

  // HANDLE DELETE TODO
  const openDeleteDialog = (todo) => {
    setDialogTodo(todo);
    setShowDeleteDialog(true);
  };

  const closeDeleteDialog = () => setShowDeleteDialog(false);

  const handleDeleteConfirm = () => {
    dispatch({
      type: dialogTodo ? "deleted" : "deleteAll",
      payload: dialogTodo ? { id: dialogTodo.id, showHideSnackbar } : "",
    });

    setDialogTodo(null);
    setShowDeleteDialog(false);
    setOpenSettingDialog(false);
    showHideSnackbar(`تم حذف جميع المهام بنجاح`);
  };

  // HANDLE EDIT TODO
  const openEditDialog = (todo) => {
    setDialogTodo(todo);
    setShowEditDialog(true);
  };

  const closeEditDialog = () => setShowEditDialog(false);

  const handleEditConfirm = () => {
    dispatch({ type: "edit", payload: { ...dialogTodo } });
    setShowEditDialog(false);
    showHideSnackbar(`تم تعديل مهمتك بنجاح`);
  };

  // HANDLE CATEGORY
  const closeCategoryDialog = () => setShowCategoryDialog(false);

  const handleAddCategoryConfirm = () => {
    if (categoryInput.trim()) {
      setCategories([...categories, categoryInput]);
      showHideSnackbar(`تم اضافة تصنيف ( ${categoryInput} ) بنجاح`);
      setCategoryInput("");
      setShowCategoryDialog(false);
    }
  };

  const deleteCategory = (category) => {
    dispatch({ type: "resetCategory", payload: { category } });
    setCategories(categories.filter((c) => (c === category ? false : true)));
  };

  const todosJSX = todosToBeRendered.map((todo) => (
    <Collapse timeout={400} key={todo.id}>
      <Todo
        todo={todo}
        showDelete={openDeleteDialog}
        showEdit={openEditDialog}
      />
    </Collapse>
  ));

  const categoriesJSX = categories.map((category, index) => (
    <ToggleButton
      key={index}
      value={category}
      sx={{
        padding: "4px 8px",
        color: mode === "light" ? "#444" : "#ddd",
        transition: "color 5s",
      }}
      onClick={() => clickedCategory(category)}
    >
      {category}
    </ToggleButton>
  ));

  const categoriesSettingJSX = categories.map((category, index) => (
    <Stack
      key={index}
      sx={{ mt: 1, backdropFilter: "blur(20px)", p: 1, borderRadius: "10px" }}
      gap="6px"
      direction="row"
      justifyContent="space-between"
      alignItems="center"
    >
      <Typography>{category}</Typography>
      <IconButton
        onClick={() => deleteCategory(category)}
        sx={{ color: "#f65353", p: 0.5 }}
      >
        <DeleteForeverRoundedIcon />
      </IconButton>
    </Stack>
  ));

  return (
    <>
      {/* Add Category Dialog */}
      <Dialog
        open={showCategoryDialog}
        onClose={closeCategoryDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">اضافة تصنيف</DialogTitle>
        <Divider />
        <DialogContent>
          <TextField
            value={categoryInput}
            onChange={(e) => setCategoryInput(e.target.value)}
            id="category"
            label="التصنيف"
            type="text"
            fullWidth
            variant="standard"
            sx={{
              "& .MuiInputBase-input": {
                padding: "10px 5px",
                color: "#fff",
              },
              "& .MuiFormLabel-root": {
                color: "#fff",
              },
              "& .MuiInput-underline.Mui-focused .MuiFormLabel-root": {
                color: theme.palette.primary.main,
              },
              "& .MuiInput-underline:before, & .MuiInput-underline:hover:before":
                {
                  borderColor: "#fff",
                },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button sx={{ color: "#c7edff" }} onClick={closeCategoryDialog}>
            إغلاق
          </Button>
          <Button
            sx={{ color: "#fff" }}
            onClick={handleAddCategoryConfirm}
            variant="contained"
            autoFocus
          >
            تأكيد
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog
        open={showDeleteDialog}
        onClose={closeDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {dialogTodo
            ? `هل تريد حذف المهمة ( ${dialogTodo?.title} )`
            : "هل تريد حذف جميع المهام؟"}
        </DialogTitle>
        <Divider />
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            sx={{ color: "#fff" }}
          >
            لا يمكنك التراجع عن الحذف
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button sx={{ color: "#c7edff" }} onClick={handleDeleteConfirm}>
            نعم، قم بالحذف
          </Button>
          <Button
            onClick={closeDeleteDialog}
            variant="contained"
            autoFocus
            sx={{ color: "#fff" }}
          >
            إغلاق
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={showEditDialog}
        onClose={closeEditDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">تعديل المهمة</DialogTitle>
        <Divider />
        <DialogContent>
          <TextField
            value={dialogTodo?.title}
            onChange={(e) =>
              setDialogTodo({
                ...dialogTodo,
                title: e.target.value,
              })
            }
            required
            margin="dense"
            id="name"
            name="title"
            label="العنوان"
            type="text"
            fullWidth
            variant="standard"
            sx={{
              "& .MuiInputBase-input": {
                padding: "10px 5px",
                color: "#fff",
              },
              "& .MuiFormLabel-root": {
                color: "#fff",
              },
              "& .MuiInput-underline.Mui-focused .MuiFormLabel-root": {
                color: theme.palette.primary.main,
              },
              "& .MuiInput-underline:before, & .MuiInput-underline:hover:before":
                {
                  borderColor: "#fff",
                },
            }}
          />

          <TextField
            value={dialogTodo?.details}
            onChange={(e) =>
              setDialogTodo({
                ...dialogTodo,
                details: e.target.value,
              })
            }
            required
            margin="dense"
            id="details"
            name="details"
            label="الوصف"
            type="text"
            fullWidth
            variant="standard"
            sx={{
              "& .MuiInputBase-input": {
                padding: "10px 5px",
                color: "#fff",
              },
              "& .MuiFormLabel-root": {
                color: "#fff",
              },
              "& .MuiInput-underline.Mui-focused .MuiFormLabel-root": {
                color: (theme) => theme.palette.primary.main,
              },
              "& .MuiInput-underline:before, & .MuiInput-underline:hover:before":
                {
                  borderColor: "#fff",
                },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button sx={{ color: "#c7edff" }} onClick={closeEditDialog}>
            إلغاء التعديل
          </Button>
          <Button
            sx={{ color: "#fff" }}
            onClick={handleEditConfirm}
            variant="contained"
            autoFocus
          >
            تأكيد
          </Button>
        </DialogActions>
      </Dialog>

      {/* Setting Dialog */}
      <Dialog
        open={openSettingDialog}
        onClose={() => setOpenSettingDialog(false)}
        keepMounted
        fullWidth
        sx={{
          ".MuiDialog-paper": {
            position: "fixed",
            top: 100,
            right: 0,
            margin: 0,
            transform: openSettingDialog ? "translateX(0)" : "translateX(100%)",
            transition: "transform 0.3s",
            direction: "rtl",
            maxWidth: 340,
          },
        }}
      >
        <Stack
          display="flex"
          alignItems="center"
          direction="row"
          justifyContent="space-between"
        >
          <DialogTitle>اعدادات التطبيق</DialogTitle>
          <IconButton
            color="primary"
            onClick={() => setOpenSettingDialog(false)}
          >
            <CloseRoundedIcon></CloseRoundedIcon>
          </IconButton>
        </Stack>
        <Divider />
        <DialogContent>
          <Typography variant="body1">الوضع</Typography>
          <ToggleButtonGroup
            value={mode}
            onChange={changeModeClicked}
            sx={{
              direction: "ltr",
              mt: 2,
              justifyContent: "center",
              display: "flex",
            }}
            color="primary"
            exclusive
          >
            <ToggleButton
              size="large"
              sx={{
                flexGrow: 1,
                color: "#fff",
              }}
              value="light"
            >
              فاتح
            </ToggleButton>
            <ToggleButton
              size="large"
              sx={{
                color: "#fff",
                flexGrow: 1,
              }}
              value="dark"
            >
              داكن
            </ToggleButton>
          </ToggleButtonGroup>

          <Divider sx={{ margin: "10px 0", bgcolor: "#009688" }} />
          <Typography variant="body1">ادارة التصنيفات</Typography>

          {categoriesSettingJSX}

          <Divider sx={{ margin: "10px 0", bgcolor: "#009688" }} />
          <Typography variant="body1">حذف المهام</Typography>
          <Button
            onClick={() => setShowDeleteDialog(true)}
            size="large"
            variant="contained"
            sx={{
              color: "#fff",
              mt: 2,
              width: "100%",
              ...(mode === "dark" && {
                "&:disabled": {
                  backgroundColor: "#333",
                  color: "#555",
                },
              }),
            }}
            disabled={todos.length === 0}
          >
            حذف جميع المهام
          </Button>
        </DialogContent>
      </Dialog>

      <Container disableGutters>
        <Card sx={{ boxShadow: "none", bgcolor: "transparent" }}>
          <CardContent sx={{ position: "relative" }}>
            {/* Settings Icon Button */}
            <IconButton
              onClick={() => setOpenSettingDialog(true)}
              color="primary"
              sx={{ position: "absolute", top: 8, right: 8 }}
            >
              <SettingsIcon sx={{ fontSize: 30 }} />
            </IconButton>

            {/* Title */}
            <Typography
              variant="h1"
              sx={{
                transition: "color .5s",
                fontWeight: "500",
                color: mode === "light" ? "#000" : "#fff",
              }}
            >
              مهامي
            </Typography>

            {/* Divider */}
            <Divider sx={{ bgcolor: "#555" }} />

            {/* Toggle Button Group for Task Filters */}
            <ToggleButtonGroup
              color="primary"
              value={todosType}
              exclusive
              onChange={changeTypeTodos}
              aria-label="text alignment"
              sx={{ mt: 7, direction: "ltr", wordBreak: "break-word" }}
            >
              {/* Add Category Button */}
              <ToggleButton
                sx={{ padding: "4px 8px" }}
                onClick={() => setShowCategoryDialog(true)}
                value="createList"
                style={{
                  backgroundColor: theme.palette.primary.main,
                  color: "#fff",
                }}
              >
                <AddRoundedIcon />
              </ToggleButton>

              {/* Categories JSX */}
              {categoriesJSX}

              {/* Non-Completed Tasks Button */}
              <ToggleButton
                sx={{
                  transition: "color .5s",
                  padding: "4px 8px",
                  color: mode === "light" ? "#444" : "#ddd",
                }}
                value="non-complated"
              >
                غير منجز
              </ToggleButton>

              {/* Completed Tasks Button */}
              <ToggleButton
                sx={{
                  transition: "color .5s",
                  padding: "4px 8px",
                  color: mode === "light" ? "#444" : "#ddd",
                }}
                value="complated"
              >
                منجز
              </ToggleButton>

              {/* All Tasks Button */}
              <ToggleButton
                sx={{
                  padding: "4px 8px",
                  color: mode === "light" ? "#444" : "#ddd",
                }}
                value="all"
              >
                الكل
              </ToggleButton>
            </ToggleButtonGroup>

            {/* Tasks List */}
            <TransitionGroup>{todosJSX}</TransitionGroup>

            {/* Task Input and Add Button */}
            <Grid container sx={{ mt: 1 }} spacing={1}>
              <Grid item xs={9}>
                <TextField
                  sx={{
                    input: {
                      color: mode === "light" ? "#000" : "#fff",
                      "&::placeholder": {
                        color: mode === "light" ? "#000" : "#fff",
                      },
                      "&:focus::placeholder": {
                        color: theme.palette.primary.main,
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "#555",
                      "&.Mui-focused": {
                        color: theme.palette.primary.main,
                      },
                    },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#666",
                      },
                      "&:hover fieldset": {
                        borderColor: "#888",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: theme.palette.primary.main,
                      },
                    },
                  }}
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (titleInput.trim()) {
                      if (e.key === "Enter") {
                        handleAddClick();
                      }
                    }
                  }}
                  fullWidth
                  id="outlined-basic"
                  label="اكتب مهمتك"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={3}>
                <Button
                  onClick={handleAddClick}
                  sx={{
                    width: "100%",
                    height: "100%",
                    fontSize: 22,
                    color: "#fff",
                    ...(mode === "dark" && {
                      "&:disabled": {
                        backgroundColor: "#333",
                        color: "#555",
                      },
                    }),
                  }}
                  size="large"
                  variant="contained"
                  disabled={!titleInput.trim()}
                >
                  اضافة
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}
