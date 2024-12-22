// Import MUI Components
import {
  Stack,
  CardContent,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";

// MUI Icons:
import PlaylistAddRoundedIcon from "@mui/icons-material/PlaylistAddRounded";
import PlaylistRemoveRoundedIcon from "@mui/icons-material/PlaylistRemoveRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import CheckRounded from "@mui/icons-material/CheckRounded";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";

// Import Theme Hook
import { useTheme } from "@mui/material/styles";

// Import React Hooks
import { useState } from "react";

// Import Contexts
import { useDispatch, useCategories } from "../contexts/todosContext";
import { useSnackbar } from "../contexts/snackbarContext";

export default function Todo({ todo, showDelete, showEdit }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const categories = useCategories();
  const { showHideSnackbar } = useSnackbar();

  const [options, setOptions] = useState(null);

  // Toggle task completion status
  const changeComplate = () =>
    dispatch({
      type: "toggleComplate",
      payload: { id: todo.id, showHideSnackbar },
    });

  // Handle menu opening and closing
  const handleOpenMenu = (event) => setOptions(event.currentTarget);
  const handleCloseMenu = () => setOptions(false);

  // Change category of a task
  const changeCategory = (category) => {
    dispatch({
      type: "changeCategory",
      payload: { id: todo.id, name: category },
    });
    handleCloseMenu();
  };

  // Generate menu items for categories
  const categoriesJSX = categories
    .filter((category) => todo.category !== category)
    .map((category) => (
      <div key={category}>
        <Divider />
        <MenuItem onClick={() => changeCategory(category)}>
          <PlaylistAddRoundedIcon sx={{ ml: 1 }} />
          اضافة الي ( {category} )
        </MenuItem>
      </div>
    ));

  return (
    <Stack sx={{ bgcolor: theme.palette.primary.dark, borderRadius: 3, mt: 2, ".MuiCardContent-root": { p: "12px  !important"}  }}>
      <CardContent >
        <Stack direction="row" justifyContent="space-between" gap={2}>
          {/* Task Title and Details */}
          <Stack gap={1}>
            <Typography
              sx={{
                fontSize: 20,
                textAlign: "right",
                fontWeight: 500,
                wordBreak: "break-word",
                color: "#fff",
              }}
            >
              {todo.title}
            </Typography>
            <Typography
              sx={{
                fontSize: 14,
                textAlign: "right",
                fontWeight: 400,
                wordBreak: "break-word",
                color: "#fff",
              }}
            >
              {todo.details}
            </Typography>
          </Stack>

          {/* Task Actions */}
          <Stack justifyContent="space-between" alignItems="end" gap={1}>
            <Stack direction="row" alignItems="center" gap={0.5}>
              {/* Menu Button */}
              <IconButton
                size="small"
                onClick={handleOpenMenu}
                style={{
                  color: "#fff",
                  backgroundColor: theme.palette.primary.light,
                }}
              >
                <MoreVertRoundedIcon />
              </IconButton>

              {/* Toggle Completion Button */}
              <IconButton
                size="small"
                onClick={changeComplate}
                style={{
                  color: todo.isCompleted
                    ? "#fff"
                    : theme.palette.primary.light,
                  backgroundColor: todo.isCompleted
                    ? theme.palette.primary.light
                    : "#fff",
                  border: `1px solid ${theme.palette.primary.light}`,
                }}
              >
                <CheckRounded />
              </IconButton>

              {/* Task Options Menu */}
              <Menu
                anchorEl={options}
                open={Boolean(options)}
                onClose={handleCloseMenu}
                elevation={0}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                sx={{
                  direction: "rtl",
                  ".MuiPaper-root": {
                    bgcolor: "#00000029",
                    backdropFilter: "blur(15px)",
                    borderRadius: 1.25,
                    color: "white",
                    border: `1px solid ${theme.palette.primary.main}`,
                  },
                  li: { p: "6px 8px" },
                  ".MuiDivider-root": { m: 0 },
                }}
              >
                <MenuItem
                  onClick={() => {
                    showEdit(todo);
                    handleCloseMenu();
                  }}
                >
                  <EditRoundedIcon sx={{ ml: 1 }} />
                  تعديل المهمة
                </MenuItem>
                <Divider />
                <MenuItem
                  onClick={() => {
                    showDelete(todo);
                    handleCloseMenu();
                  }}
                >
                  <DeleteForeverRoundedIcon sx={{ ml: 1 }} />
                  حذف المهمة
                </MenuItem>
                {categoriesJSX}
                {todo.category && (
                  <>
                    <Divider />
                    <MenuItem onClick={() => changeCategory("")}>
                      <PlaylistRemoveRoundedIcon sx={{ ml: 1 }} /> ازالة من ({" "}
                      {todo.category} )
                    </MenuItem>
                  </>
                )}
              </Menu>
            </Stack>

            {/* Task Timestamp */}
            <Typography sx={{ fontSize: 14, fontWeight: 100, color: "#eee" }}>
              {todo.time}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Stack>
  );
}
