import { useState, useEffect } from "react";
import * as React from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import TimePicker from "@mui/lab/TimePicker";
import Typography from "@mui/material/Typography";
import { blue, red, green } from "@mui/material/colors";
import Container from "@mui/material/Container";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import Paper from "@mui/material/Paper";

const theme = createTheme();

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Edit = (props) => {
  const [user, setUser] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [batch, setBatch] = useState("");
  const [shop, setShop] = useState("");
  const [age, setAge] = useState();
  const [password, setPassword] = useState("");
  const [cpassword, setCPassword] = useState("");
  const [CloseTime, setCloseTime] = React.useState();
  const [StartTime, setStartTime] = React.useState();
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    axios
      .post("http://localhost:4000/api/user/editget", {
        id: localStorage.getItem("Token"),
        user: localStorage.getItem("User"),
      })
      .then((response) => {
        // console.log(response.data);
        setUser(response.data.user);
        if (user === "Vendor") {
          setName(response.data.name);
          setEmail(response.data.email);
          setPhone(response.data.phone);
          setPassword(response.data.password);
          setCPassword(response.data.password);
          setShop(response.data.shop);
          setStartTime(response.data.starttime);
          setCloseTime(response.data.closetime);
        } else {
          setName(response.data.name);
          setEmail(response.data.email);
          setPhone(response.data.phone);
          setPassword(response.data.password);
          setCPassword(response.data.password);
          setBatch(response.data.batch);
          setAge(response.data.age);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const onChangeCloseTime = (newValue) => {
    setCloseTime(newValue);
  };

  const onChangeStartTime = (newValue) => {
    setStartTime(newValue);
  };

  const onChangeShop = (event) => {
    setShop(event.target.value);
  };

  const onChangeCPassword = (event) => {
    setCPassword(event.target.value);
  };

  const onChangePassword = (event) => {
    setPassword(event.target.value);
  };

  const onChangeAge = (event) => {
    setAge(event.target.value);
  };

  const onChangeBatch = (event) => {
    setBatch(event.target.value);
  };

  const onChangePhone = (event) => {
    setPhone(event.target.value);
  };

  const onChangeUser = (event) => {
    setUser(event.target.value);
  };

  const onChangeName = (event) => {
    setName(event.target.value);
  };

  const onChangeEmail = (event) => {
    setEmail(event.target.value);
  };

  const resetInputs = () => {
    setName("");
    setEmail("");
    setPhone("");
    setUser("");
    setPassword("");
    setCPassword("");
  };

  const onSubmit = (event) => {
    event.preventDefault();
    let newUser;
    setUser(localStorage.getItem("User"));
    if (user === "Vendor") {
      newUser = {
        name: name,
        user: user,
        shop: shop,
        starttime: StartTime,
        closetime: CloseTime,
        phone: phone,
        email: email,
        password: password,
      };
    } else {
      newUser = {
        name: name,
        user: user,
        batch: batch,
        age: age,
        phone: phone,
        email: email,
        password: password,
      };
    }
    axios
      .post("http://localhost:4000/api/user/edit", {
        id: localStorage.getItem("Token"),
        details: newUser,
      })
      .then((response) => {
        alert("Edited\t" + response.data.name);
        // console.log(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
    resetInputs();
  };

  return (
    // <Grid container align={"center"} spacing={2}>
    //   <Grid item xs={12}>
    //     <TextField
    //       label="Name"
    //       variant="outlined"
    //       value={name}
    //       onChange={onChangeUsername}
    //     />
    //   </Grid>
    //   <Grid item xs={12}>
    //     <TextField
    //       label="Email"
    //       variant="outlined"
    //       value={email}
    //       onChange={onChangeEmail}
    //     />
    //   </Grid>
    //   <Grid item xs={12}>
    //     <Button variant="contained" onClick={onSubmit}>
    //       Register
    //     </Button>
    //   </Grid>
    // </Grid>
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Paper elevation={6} sx={{ width: 450 }}>
            <Paper elevation={0} sx={{ margin: 3 }}>
              <Typography component="h1" variant="h4" sx={{ color: blue[800] }}>
                Edit Profile
              </Typography>
              <Box component="form" onSubmit={onSubmit} sx={{ mt: 1 }}>
                <TextField
                  id="user"
                  name="user"
                  select
                  required
                  label="User"
                  value={localStorage.getItem("User")}
                  onChange={onChangeUser}
                  sx={{ minWidth: 400, mt: 2 }}
                  disabled
                >
                  <MenuItem value={"Buyer"}>Buyer</MenuItem>
                  <MenuItem value={"Vendor"}>Vendor</MenuItem>
                </TextField>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="name"
                  value={name}
                  onChange={onChangeName}
                  label="Name"
                  name="name"
                  autoComplete="name"
                  autoFocus
                />
                {user === "Vendor" ? (
                  <Grid container>
                    <Grid item xs={12} sx={{ paddingTop: 1, paddingBottom: 2 }}>
                      <TextField
                        required
                        fullWidth
                        id="shop"
                        label="Shop Name"
                        name="shop"
                        value={shop}
                        onChange={onChangeShop}
                        autoComplete="shop"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <TimePicker
                          label="Start Time"
                          name="Start Time"
                          value={StartTime}
                          onChange={onChangeStartTime}
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <TimePicker
                          label="Close Time"
                          name="Close Time"
                          value={CloseTime}
                          onChange={onChangeCloseTime}
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </LocalizationProvider>
                    </Grid>
                  </Grid>
                ) : (
                  <Grid container sx={{ paddingTop: 1 }}>
                    <Grid item xs={12} sm={6}>
                      <FormControl sx={{ width: 1 }}>
                        <InputLabel id="demo" required>
                          Batch
                        </InputLabel>
                        <Select
                          labelId="batch"
                          id="batch"
                          value={batch}
                          name="batch"
                          required
                          onChange={onChangeBatch}
                          label="Batch"
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          <MenuItem value={"UG1"} sx={{ width: 1 }}>
                            UG1
                          </MenuItem>
                          <MenuItem value={"UG2"} sx={{ width: 1 }}>
                            UG2
                          </MenuItem>
                          <MenuItem value={"UG3"} sx={{ width: 1 }}>
                            UG3
                          </MenuItem>
                          <MenuItem value={"UG4"} sx={{ width: 1 }}>
                            UG4
                          </MenuItem>
                          <MenuItem value={"UG5"} sx={{ width: 1 }}>
                            UG5
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        id="age"
                        label="Age"
                        name="age"
                        autoComplete="age"
                        value={age}
                        onChange={onChangeAge}
                      />
                    </Grid>
                  </Grid>
                )}
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="phone"
                  value={phone}
                  label="Contact Number"
                  name="phone"
                  autoComplete="phone"
                  onChange={onChangePhone}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  value={localStorage.getItem("Email")}
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  onChange={onChangeEmail}
                  //   disabled
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  value={password}
                  label="Password"
                  type="password"
                  id="password"
                  onChange={onChangePassword}
                  autoComplete="current-password"
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="cpassword"
                  value={cpassword}
                  label="Confirm Password"
                  type="password"
                  id="cpassword"
                  onChange={onChangeCPassword}
                />
                {password !== cpassword &&
                password !== undefined &&
                cpassword !== undefined ? (
                  <Snackbar
                    open={true}
                    autoHideDuration={6000}
                    onClose={handleClose}
                  >
                    <Alert
                      onClose={handleClose}
                      severity="error"
                      sx={{ width: "100%" }}
                    >
                      Passwords do not match !!
                    </Alert>
                  </Snackbar>
                ) : (
                  <></>
                )}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Update
                </Button>
              </Box>
            </Paper>
          </Paper>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Edit;
