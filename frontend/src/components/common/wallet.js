import * as React from "react";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useTheme } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { Button, Icon, TextField, Paper, Typography } from "@material-ui/core";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { blue, purple, violet, pink } from "@mui/material/colors";

const Wallet = (props) => {
  // const [user, setUser] = useState("");
  const [total, setTotal] = useState();
  const [amount, setAmount] = useState();

  useEffect(() => {
    axios
      .post("http://localhost:4000/api/user/walletget", {
        email: localStorage.getItem("Email"),
      })
      .then((response) => {
        console.log(response.data);
        setTotal(response.data.wallet);
        // localStorage.setItem("Wallet", response.data.wallet);
        // setItems(response.data);
        // setSortedItems(response.data);
        // setSearchText("");
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    axios
      .post("http://localhost:4000/api/user/walletadd", {
        id: localStorage.getItem("Token"),
        wallet: total,
      })
      .then((response) => {
        console.log(response.data);
        // setItems(response.data);
        // setSortedItems(response.data);
        // setSearchText("");
      })
      .catch((error) => {
        console.log(error);
      });
    localStorage.setItem("Wallet", total);
  }, [total]);

  const onChangeAmount = (event) => {
    setAmount(event.target.value);
  };

  const onChangeTotal = (amount) => {
    setTotal(total + +amount);
  };

  return (
    <Grid container align={"center"} spacing={2}>
      <Grid item xs={12}>
        <AccountBalanceWalletIcon sx={{ fontSize: 300, color: purple[600] }} />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6">{total}</Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField
          margin="normal"
          id="amount"
          label="Amount"
          name="amount"
          onChange={onChangeAmount}
          autoFocus
        ></TextField>
      </Grid>
      <Grid item xs={12}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          onClick={() => {
            onChangeTotal(amount);
          }}
        >
          Add to wallet <ArrowForwardIcon sx={{ paddingLeft: 2 }} />
        </Button>
      </Grid>
    </Grid>
  );
};

export default Wallet;
