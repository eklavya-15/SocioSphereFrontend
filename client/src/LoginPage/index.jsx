import React from "react";
import {
  Box,
  Typography,
  useMediaQuery,
  Grid,
} from "@mui/material";
import Form from "./Form";

const LoginPage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

  return (
    <Grid container justifyContent="center">
      {/* Header */}
      <Grid item xs={12}>
        <Box
          width="100%"
          bgcolor="#CAF4FF"
          p="1rem 6%"
          textAlign="center"
        >
          <Typography fontWeight="bold" fontSize="32px" color="#005C78">
            SocioSphere
          </Typography>
        </Box>
      </Grid>

      {/* Form Section */}
      <Grid item xs={12} md={isNonMobileScreens ? 6 : 10}>
        <Box
          p="2rem"
          m="2rem auto"
          borderRadius="1.5rem"
          bgcolor="#CAF4FF"
        >
          <Form />
        </Box>
      </Grid>
    </Grid>
  );
};

export default LoginPage;

