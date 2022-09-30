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
import { red, green } from "@mui/material/colors";
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

const Order = (props) => {
  const [orders, setOrders] = useState([]);
  // const [rating, setRating] = useState();

  const onChangeRating = (event, newValue) => {
    const x = orders.find((order) => order._id === event.target.id);
    if (x.rating === -1) {
      x.rating = newValue;
      console.log(x);
      axios
        .post("http://localhost:4000/api/user/rating", {
          id: event.target.id,
          rating: newValue,
        })
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const nextStage = (event) => {
    const x = orders.find((order) => order._id === event.target.id);
    x.stage = "COMPLETED";
    setOrders([...orders]);
    axios
      .post("http://localhost:4000/api/user/stage", {
        id: event.target.id,
        stage: x.stage,
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    axios
      .post("http://localhost:4000/api/user/buyerorders", {
        email: localStorage.getItem("Email"),
      })
      .then((response) => {
        console.log(response.data);
        setOrders(response.data.foods);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  return (
    <div>
      <Container style={{ display: "flex", justifyContent: "center" }}>
        <Paper>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ minWidth: 100 }}> Sr No.</TableCell>
                <TableCell sx={{ minWidth: 250 }}>Placed time</TableCell>
                <TableCell sx={{ minWidth: 250 }}>Item name</TableCell>
                <TableCell sx={{ minWidth: 250 }}>Quantity</TableCell>
                <TableCell sx={{ minWidth: 100 }}>Cost</TableCell>
                <TableCell sx={{ minWidth: 100 }}>Status</TableCell>
              </TableRow>
            </TableHead>
          </Table>
          {orders.map((x, ind) => (
            <Card
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              key={x._id}
            >
              <CardContent sx={{ flex: "1 0 auto" }}>
                <Grid
                  container
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Grid item>{ind + 1}</Grid>
                  <Grid item sx={{ display: "flex", width: 200 }}>
                    <Typography component="div" variant="h6">
                      {new Date(x.ptime).toLocaleTimeString()}
                    </Typography>
                  </Grid>
                  <Grid item sx={{ width: 240 }}>
                    <Typography component="div" variant="h6">
                      {x.itemname}
                    </Typography>
                  </Grid>
                  <Grid item sx={{ width: 110 }}>
                    <Typography component="div" variant="h6">
                      {x.quantity}
                    </Typography>
                  </Grid>
                  <Grid item sx={{ width: 130 }}>
                    <Typography component="div" variant="h6">
                      {x.price}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography component="div" variant="h6">
                      {x.stage}
                    </Typography>
                    {x.stage === "READY FOR PICKUP" ? (
                      <>
                        <Button onClick={nextStage} id={x._id}>
                          PICKUP
                        </Button>
                      </>
                    ) : (
                      [
                        x.stage === "COMPLETED" ? (
                          <Rating
                            // id=
                            name={x._id}
                            value={x.rating}
                            readOnly={x.rating > -1}
                            onChange={(event, newValue) => {
                              console.log(event.target);
                              const x = orders.find(
                                (order) => order._id === event.target.name
                              );
                              // x.rating = newValue;
                              console.log(x);
                              axios
                                .post("http://localhost:4000/api/user/rating", {
                                  id: event.target.name,
                                  rating: newValue,
                                })
                                .then((response) => {
                                  console.log(response.data);
                                })
                                .catch((error) => {
                                  console.log(error.data);
                                });
                            }}
                            sx={{ fontSize: 20 }}
                          />
                        ) : (
                          <></>
                        ),
                      ]
                    )}
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
        </Paper>
      </Container>
    </div>
  );
};

export default Order;
