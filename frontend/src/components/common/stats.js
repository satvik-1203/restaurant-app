import * as React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Paper from "@mui/material/Paper";
import { useTheme } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Rating from "@mui/material/Rating";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Tooltip } from "@mui/material";
import CardMedia from "@mui/material/CardMedia";
import FormGroup from "@mui/material/FormGroup";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Slider from "@mui/material/Slider";
import Divider from "@mui/material/Divider";
import { red, green, yellow, common } from "@mui/material/colors";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import AddBoxIcon from "@mui/icons-material/AddBox";

import {
  ArgumentAxis,
  ValueAxis,
  Chart,
  BarSeries,
} from "@devexpress/dx-react-chart-material-ui";

const Stats = (props) => {
  const [orders, setOrders] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [buyers, setBuyers] = useState([]);
  const [placed, setPlaced] = useState();
  const [batches, setBatches] = useState([]);
  const [foods, setFoods] = useState([]);
  const [top, setTop] = useState([]);
  const [ages, setAges] = useState([]);
  const [pending, setPending] = useState();
  const [c, setC] = useState();
  useEffect(() => {
    let place = 0,
      pendin = 0;
    for (let i in orders) {
      if (
        orders[i].stage === "ACCEPTED" ||
        orders[i].stage === "COOKING" ||
        orders[i].stage === "READY FOR PICKUP"
      ) {
        pendin++;
      }
      place++;
    }
    setPending(pendin);
    setPlaced(place);
    const comp = orders.filter((order) => order.stage === "COMPLETED");
    setC(comp.length);
    setCompleted(comp);
    const buyer = comp.map((obj) => obj.__buyerID);
    console.log(buyer);
    axios
      .post("http://localhost:4000/api/user/ordersb", buyer)
      .then((response) => {
        console.log(response.data);
        setBuyers(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
    let ug1 = 0,
      ug2 = 0,
      ug3 = 0,
      ug4 = 0,
      ug5 = 0;
    for (let i in buyers) {
      switch (buyers[i].batch) {
        case "UG1":
          ug1++;
          break;
        case "UG2":
          ug2++;
          break;
        case "UG3":
          ug3++;
          break;
        case "UG4":
          ug4++;
          break;
        case "UG5":
          ug5++;
          break;
        default:
          break;
      }
    }
    const data = [
      { argument: "UG1", value: ug1 },
      { argument: "UG2", value: ug2 },
      { argument: "UG3", value: ug3 },
      { argument: "UG4", value: ug4 },
      { argument: "UG5", value: ug5 },
    ];
    setBatches(data);
    let arr = new Array(41).fill(0);
    for (let i in buyers) {
      arr[buyers[i].age - 10]++;
    }
    var result = buyers.map((person) => ({
      argument: person.age,
      value: arr[person.age - 10],
    }));
    setAges(result);
  }, [orders, buyers]);

  useEffect(() => {
    foods.sort((a, b) => (a.sold < b.sold ? 1 : -1));
    let temp = [];
    for (let i = 0; i < 5 && i < foods.length; i++) {
      temp.push(foods[i]);
    }
    console.log(temp);
    setTop(temp);
  }, [foods]);
  useEffect(() => {
    axios
      .post("http://localhost:4000/api/user/vendororders", {
        email: localStorage.getItem("Email"),
      })
      .then((response) => {
        setOrders(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
    axios
      .post("http://localhost:4000/api/user/vendoritems", {
        email: localStorage.getItem("Email"),
      })
      .then((response) => {
        console.log(response.data);
        setFoods(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div>
      <Container style={{ display: "flex", justifyContent: "center" }}>
        <Paper>
          <Grid container>
            <Grid item sx={{ padding: 3 }}>
              <Typography component="div" variant="h6">
                Orders Placed: {placed}
              </Typography>
            </Grid>
            <Grid item sx={{ padding: 3 }}>
              <Typography component="div" variant="h6">
                Orders Pending: {pending}
              </Typography>
            </Grid>
            <Grid item sx={{ padding: 3 }}>
              <Typography component="div" variant="h6">
                Orders Completed: {c}
              </Typography>
            </Grid>
            <Grid item sx={{ padding: 3 }}>
              <Typography component="div" variant="h6">
                Your Top Items:
              </Typography>
              <Grid container>
                {top.map((x, ind) => (
                  <Grid item>
                    <Card sx={{ padding: 1 }}>{x.name}</Card>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item sx={{ bgcolor: green[800], minWidth: 500, margin: 3 }}>
              <Chart data={batches}>
                <ArgumentAxis />
                <ValueAxis />
                <BarSeries valueField="value" argumentField="argument" />
              </Chart>
              <Typography
                component="div"
                variant="h6"
                paddingLeft={20}
                color={common["white"]}
              >
                Batchwise Distribution
              </Typography>
            </Grid>
            <Grid item sx={{ bgcolor: yellow[800], minWidth: 500, margin: 3 }}>
              <Chart data={ages}>
                <ArgumentAxis />
                <ValueAxis />
                <BarSeries valueField="value" argumentField="argument" />
              </Chart>

              <Typography
                component="div"
                variant="h6"
                paddingLeft={20}
                color={common["white"]}
              >
                Agewise Distribution
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </div>
  );
};

export default Stats;
