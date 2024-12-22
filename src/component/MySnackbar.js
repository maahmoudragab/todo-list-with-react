// Material-UI Components
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useTheme } from "@mui/material/styles";

const MySnackbar = ({ open, message }) => {
  const theme = useTheme();

  return (
    <Snackbar open={open}>
      <Alert
        variant="filled"
        severity="success"
        sx={{
          textAlign: "right",
          backgroundColor: theme.palette.primary.main,
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default MySnackbar;
