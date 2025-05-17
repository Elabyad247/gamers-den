import { Box, CircularProgress } from "@mui/material";
import { loadingBoxStyles } from "../utils/theme";

const LoadingBox = () => {
  return (
    <Box sx={loadingBoxStyles}>
      <CircularProgress />
    </Box>
  );
};

export default LoadingBox;
