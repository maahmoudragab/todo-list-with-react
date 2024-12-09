// From MUI
import { Divider, Grid, TextField } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
// Dialog Model
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

// Icons
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import ModeEditTwoToneIcon from "@mui/icons-material/ModeEditTwoTone";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";

// Hooks
import { useContext, useState } from "react";

// Context
import { TodosContext } from "./contexts/todosContext";

// Theme
import { useTheme } from "@mui/material/styles";



export default function Todo({ todo }) {
  const theme = useTheme()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editTodo, setEditTodo] = useState({
    title: todo.title,
    details: todo.details,
  });
  const { todos, setTodos } = useContext(TodosContext);

  const handleCheckClick = () => {
    const updateTodo = todos.map((t) => {
      if (t.id === todo.id) {
        t.isCompleted = !t.isCompleted;
      }
      return t;
    });
    setTodos(updateTodo);
    localStorage.setItem("todos", JSON.stringify(updateTodo));
  };

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const showEditClick = () => {
    setShowEditDialog(true);
  };

  const handleDeleteDialogClose = () => {
    setShowDeleteDialog(false);
  };

  const handleEditDialogClose = () => {
    setShowEditDialog(false);
  };

  const handleDeleteConfirm = () => {
    const deleteTodo = todos.filter((t) => t.id !== todo.id);
    setTodos(deleteTodo);
    localStorage.setItem("todos", JSON.stringify(deleteTodo));
  };

  const handleEditConfirm = () => {
    const editTodoConfirm = todos.map((t) => {
      if (t.id === todo.id) {
        return { ...t, title: editTodo.title, details: editTodo.details };
      } else {
        return t;
      }
    });
    setTodos(editTodoConfirm);
    localStorage.setItem("todos", JSON.stringify(editTodoConfirm));
    setShowEditDialog(false);
  };

  return (
    <>
      {/* Delete Model */}
      <Dialog
        sx={{ textAlign: "right" }}
        open={showDeleteDialog}
        onClose={handleDeleteDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" sx={{ textAlign: "center" }}>
          هل تريد حذف المهمه ( {todo.title} )
        </DialogTitle>
        <Divider />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            لا يمكنك التراجع عن الحذف
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteConfirm}>نعم، قم بالحذف</Button>
          <Button
            onClick={handleDeleteDialogClose}
            variant="contained"
            autoFocus
          >
            إغلاق
          </Button>
        </DialogActions>
      </Dialog>
      {/* == Delete Model == */}

      <Dialog
        sx={{ textAlign: "right" }}
        open={showEditDialog}
        onClose={handleEditDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" sx={{ textAlign: "center" }}>
          تعديل المهمة
        </DialogTitle>
        <Divider />
        <DialogContent>
          <TextField
            value={editTodo.title}
            onChange={(e) => {
              setEditTodo({ ...editTodo, title: e.target.value });
            }}
            required
            margin="dense"
            id="name"
            name="title"
            label="العنوان"
            type="text"
            fullWidth
            variant="standard"
            style={{ textAlign: "right" }}
            sx={{
              width: "100%",
              "& .MuiInputBase-input": {
                padding: "10px 5px",
                textAlign: "right",
              },
            }}
          />

          <TextField
            value={editTodo.details}
            onChange={(e) => {
              setEditTodo({ ...editTodo, details: e.target.value });
            }}
            required
            margin="dense"
            id="name"
            name="title"
            label="الوصف"
            type="text"
            fullWidth
            variant="standard"
            sx={{
              width: "100%",
              "& .MuiInputBase-input": {
                padding: "10px 5px",
                textAlign: "right",
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditDialogClose}>الغاء التعديل</Button>
          <Button onClick={handleEditConfirm} variant="contained" autoFocus>
            تأكيد
          </Button>
        </DialogActions>
      </Dialog>
      {/* Edit Model */}

      {/* == Edit Model == */}
      <Card
        sx={{ mt: 3, bgcolor: theme.palette.primary.dark, borderRadius: 3, color: "#fff" }}
      >
        <CardContent>
          <Grid container alignItems="center">
            <Grid item container xs={8} gap={1} direction="column">
              <Typography
                variant="h5"
                sx={{
                  textAlign: "right",
                  fontWeight: "normal",
                  wordBreak: "break-word",
                }}
              >
                {todo.title}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  textAlign: "right",
                  fontWeight: "200",
                  wordBreak: "break-word",
                }}
              >
                {todo.details}
              </Typography>
            </Grid>
            <Grid
              item
              xs={4}
              display="flex"
              alignItems="center"
              justifyContent="space-around"
            >
              {/* Check Icon */}
              <IconButton
                onClick={handleCheckClick}
                style={{
                  color: todo.isCompleted ? "#fff" : "#8bc34a",
                  backgroundColor: todo.isCompleted ? "#8bc34a" : "#fff",
                  border: "3px solid #8bc34a",
                }}
              >
                <CheckRoundedIcon />
              </IconButton>
              {/* == Check Icon == */}
              {/* Edit Icon */}
              <IconButton
                onClick={showEditClick}
                style={{
                  color: "#009688",
                  backgroundColor: "#fff",
                  border: "3px solid #009688",
                }}
              >
                <ModeEditTwoToneIcon />
              </IconButton>
              {/* == Edit Icon == */}

              {/* Delete Button */}
              <IconButton
                onClick={handleDeleteClick}
                style={{
                  color: "#ff3939",
                  backgroundColor: "#fff",
                  border: "3px solid #ff3939",
                }}
              >
                <DeleteOutlineRoundedIcon />
                {/* == Delete Button == */}
              </IconButton>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  );
}
