import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { blue, red, green } from "@mui/material/colors";
import Paper from "@mui/material/Paper";

const SignIn = (props) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const onChangeEmail = (event) => {
    setEmail(event.target.value);
  };
  const onChangePassword = (event) => {
    setPassword(event.target.value);
  };
  const resetInputs = () => {
    setEmail("");
    setPassword("");
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    const User = {
      email: email,
      password: password,
    };
    axios
      .post("http://localhost:4000/api/user/", User)
      .then((response) => {
        // console.log(response.data)
        localStorage.setItem("Email", email);
        localStorage.setItem("User", response.data.user);
        localStorage.setItem("Token", response.data.token);
        localStorage.setItem("Wallet", response.data.wallet);
        localStorage.setItem("Name", response.data.name);
        //  console.log(response.data.token)
        // console.log(response.data.user)
        window.location.href = "/login/redirect";
      })
      .catch(() => {
        alert("Email or password incorrect");
      });
    resetInputs();
    // eslint-disable-next-line no-console
    // console.log({
    //   email: data.get('email'),
    //   password: data.get('password'),
    // });
  };
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper elevation={6} sx={{ width: 450 }}>
          <Paper elevation={0} sx={{ margin: 3 }}>
            <Typography component="h1" variant="h4" sx={{ color: blue[800] }}>
              Canteen Portal
            </Typography>
            <Typography component="h1" variant="h5" sx={{ paddingTop: 2 }}>
              Sign in
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                onChange={onChangeEmail}
                value={email}
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                value={password}
                onChange={onChangePassword}
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                // onClick={() => navigate("/home")}
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item sx={{ paddingLeft: 10 }}>
                  <Link a href="/register" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Paper>
      </Box>
    </Container>
  );
};

export default SignIn;
