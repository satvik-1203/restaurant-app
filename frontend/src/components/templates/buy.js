import * as React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Paper from "@mui/material/Paper";
import { useTheme } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormGroup from "@mui/material/FormGroup";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import List from "@mui/material/List";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import ListItem from "@mui/material/ListItem";
import Slider from "@mui/material/Slider";
import Divider from "@mui/material/Divider";
import { red, green, common, yellow } from "@mui/material/colors";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import SearchIcon from "@mui/icons-material/Search";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import CssBaseline from "@mui/material/CssBaseline";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import CloseIcon from "@mui/icons-material/Close";

function valuetext(value) {
  return `${value}`;
}

const Buy = (props) => {
  const navigate = useNavigate();
  if (localStorage.getItem("Token") == null) {
    window.location.href = "/login/redirect";
  }
  const theme = useTheme();
  const [name, setName] = useState("");
  const [addons, setAddons] = useState([]);
  const [faddons, setFAddons] = useState([]);
  const [checked, setChecked] = useState([]);
  const [price, setPrice] = useState();
  const [total, setTotal] = useState();
  const [final, setFinal] = useState();
  const [number, setNumber] = useState([1]);
  const [image, setImage] = useState();
  const [id, setId] = useState();
  const [vid, setVid] = useState();

  const onChangeTotal = (event) => {
    if (event.target.checked) {
      setTotal(total + +addons[event.target.id].price);
      setFinal((total + +addons[event.target.id].price) * number);
      setFAddons([...faddons, addons[event.target.id]]);
    } else {
      setTotal(total - +addons[event.target.id].price);
      setFinal((total - +addons[event.target.id].price) * number);
      setFAddons(faddons.filter((x) => x != addons[event.target.id]));
    }
  };

  const onChangeNumber = (event) => {
    setNumber(event.target.value);
    setFinal(total * event.target.value);
  };

  useEffect(() => {
    const id = localStorage.getItem("Item");
    axios
      .post("http://localhost:4000/api/user/buyget", { id: id })
      .then((response) => {
        setName(response.data.name);
        setPrice(response.data.price);
        setTotal(response.data.price);
        setFinal(response.data.price);
        setAddons(response.data.addons);
        setId(response.data._id);
        setVid(response.data.__vendorID);
      })
      .catch((err) => {
        alert(err);
      });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const val = localStorage.getItem("Wallet");
    if (val < final) {
      alert("Not enough money in wallet");
      return;
    }
    const bID = localStorage.getItem("Token");
    const order = {
      name: name,
      __buyerID: bID,
      __vendorID: vid,
      __foodID: id,
      quantity: number[0],
      addons: faddons,
      price: final,
    };
    axios
      .post("http://localhost:4000/api/user/order", order)
      .then((response) => {
        alert("Order Placed");
      })
      .catch((err) => {
        console.log(err);
      });
    axios
      .post("http://localhost:4000/api/user/walletadd", {
        id: localStorage.getItem("Token"),
        wallet: val - final,
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
    localStorage.setItem("Wallet", val - final);
  };

  return (
    <div>
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
          <ShoppingCartIcon sx={{ fontSize: 50 }} />
          <Typography component="h1" variant="h5">
            Buy {name}
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Slider
              getAriaLabel={() => "Price range"}
              value={number}
              min={0}
              max={20}
              onChange={onChangeNumber}
              valueLabelDisplay="auto"
              getAriaValueText={valuetext}
            />
            <TextField
              id="standard-basic"
              label="Enter Quantity"
              value={number}
              onChange={onChangeNumber}
            />
            {addons.map((x, ind) => (
              <CardContent sx={{ flex: "1 0 auto" }}>
                <Grid
                  container
                  sx={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Grid item sx={{ paddingTop: 0.5 }}>
                    <Typography component="h1" variant="h6">
                      Add {x.name} for Rs.{x.price}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Checkbox id={ind} onChange={onChangeTotal}></Checkbox>
                    {checked}
                  </Grid>
                </Grid>
              </CardContent>
            ))}
            <Typography component="h1" variant="h6">
              Total: Rs.{final}
            </Typography>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Buy
            </Button>
          </Box>
        </Box>
      </Container>
    </div>
  );
};

export default Buy;
