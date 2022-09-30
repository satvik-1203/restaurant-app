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
import NewItem from "../templates/newitem";
import EditItem from "../templates/edititem";
import emailjs from "@emailjs/browser";

function valuetext(value) {
  return `${value}`;
}

const stages = [
  "PLACED",
  "ACCEPTED",
  "COOKING",
  "READY FOR PICKUP",
  "COMPLETED",
  "REJECTED",
];

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const Vendor = (props) => {
  const navigate = useNavigate();
  if (localStorage.getItem("Token") == null) {
    window.location.href = "/login/redirect";
  }

  const theme = useTheme();
  const [items, setItems] = useState([]);
  const [sortedItems, setSortedItems] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [value, setValue] = React.useState([50]);
  const [tag, setTag] = React.useState([]);
  const [shop, setShop] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [open1, setOpen1] = React.useState(false);
  const [foods, setFoods] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
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

    axios
      .post("http://localhost:4000/api/user/vendororders", {
        email: localStorage.getItem("Email"),
      })
      .then((response) => {
        console.log(response.data);
        setOrders(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleClickOpen1 = (event) => {
    console.log(event.target);
    localStorage.setItem("Item", event.target.id);
    setOpen1(true);
  };

  const handleClose1 = () => {
    setOpen1(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const addTag = (event) => {
    const {
      target: { value },
    } = event;
    setTag(typeof value === "string" ? value.split(",") : value);
  };

  const customFunction = (event) => {
    console.log(event.target.value);
    setSearchText(event.target.value);
  };

  const nextStage = (event) => {
    let pending = 0;
    for (let i in orders) {
      if (orders[i].stage === "ACCEPTED" || orders[i].stage === "COOKING") {
        pending++;
      }
    }
    const x = orders.find((order) => order._id === event.target.id);
    if (pending < 10 || x.stage !== "PLACED") {
      x.stage =
        stages[
          stages.indexOf(x.stage) < 3
            ? stages.indexOf(x.stage) + 1
            : stages.indexOf(x.stage)
        ];
      setOrders([...orders]);
      axios
        .post("http://localhost:4000/api/user/stage", {
          id: event.target.id,
          stage: x.stage,
        })
        .then((response) => {
          // console.log(response.data);
          const stage = response.data.result.stage;
          const buyer = response.data.buyer;
          console.log(stage);
          if (stage === "ACCEPTED" || stage === "REJECTED") {
            var data = {
              service_id: "service_z3cnv95",
              template_id: "template_dz7d6ti",
              user_id: "user_RyyMVE4xq07QfSITfhSAu",
              template_params: {
                to_name: buyer.name,
                message: stage,
                to_email: buyer.email,
              },
            };
            axios
              .post("https://api.emailjs.com/api/v1.0/email/send", {
                data: data,
              })
              .then((response) => {
                console.log(response.data);
              })
              .catch((error) => {
                console.log(error);
              });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      alert("Too many pending orders !!");
      return;
    }
  };

  const reject = (event) => {
    const x = orders.find((order) => order._id === event.target.id);
    x.stage = "REJECTED";
    setOrders([...orders]);
    axios
      .post("http://localhost:4000/api/user/stage", {
        id: event.target.id,
        stage: x.stage,
        rating: 0,
      })
      .then((response) => {
        console.log(response.data);
        const stage = response.data.result.stage;
        const buyer = response.data.buyer;
        console.log(stage);
        var data = {
          service_id: "service_z3cnv95",
          template_id: "template_dz7d6ti",
          user_id: "user_RyyMVE4xq07QfSITfhSAu",
          template_params: {
            to_name: buyer.name,
            message: stage,
            to_email: buyer.email,
          },
        };
        axios
          .post("https://api.emailjs.com/api/v1.0/email/send", {
            data: data,
          })
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deleteitem = (event) => {
    axios
      .post("http://localhost:4000/api/user/deleteitem", {
        id: event.target.id,
        vid: localStorage.getItem("Token"),
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <Grid container>
        <Grid item xs={12} md={3} lg={3}>
          <List component="nav" aria-label="mailbox folders">
            <ListItem>
              <Typography component="h1" variant="h5">
                My items
              </Typography>
              <Button onClick={handleClickOpen}>
                <AddBoxIcon />
              </Button>
              <Dialog open={open} onClose={handleClose}>
                <NewItem />
              </Dialog>
            </ListItem>
            {foods.map((x) => (
              <Card sx={{ display: "flex", maxWidth: 340 }} key={x._id}>
                <Box sx={{ display: "flex", flexDirection: "row" }}>
                  {/* <CardMedia
                    component="img"
                    sx={{ width: 151 }}
                    image={x.image}
                    alt="Live from space album cover"
                  /> */}
                  <CardContent sx={{ flex: "1 0 auto", maxWidth: 340 }}>
                    <Grid container sx={{ maxWidth: 340 }}>
                      <Grid item>
                        <Typography component="div" variant="h6">
                          {x.name}
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          color="text.secondary"
                          component="div"
                          sx={{ fontSize: 15 }}
                        >
                          Price: {x.price} Rating:{" "}
                          <Rating
                            name="read-only"
                            value={x.rating}
                            readOnly
                            sx={{ fontSize: 15 }}
                          />
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Tooltip title="Edit">
                          <Button
                            onClick={handleClickOpen1}
                            id={x._id}
                            sx={{ zindex: 1 }}
                          >
                            Edit
                          </Button>
                        </Tooltip>
                        <Dialog open={open1} onClose={handleClose1}>
                          <EditItem />
                        </Dialog>
                      </Grid>
                      <Grid item>
                        <Tooltip title="Delete">
                          <Button onClick={deleteitem} id={x._id}>
                            DELETE
                          </Button>
                        </Tooltip>
                      </Grid>
                    </Grid>
                  </CardContent>
                  <Box
                    sx={{ display: "flex", alignItems: "center", pl: 1, pb: 1 }}
                  ></Box>
                </Box>
              </Card>
            ))}
          </List>
        </Grid>
        <Grid item xs={12} md={3} lg={3}>
          <List component="nav" aria-label="mailbox folders">
            <ListItem>
              <Typography component="h1" variant="h5">
                My Orders
              </Typography>
            </ListItem>
            <ListItem>
              <Paper>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ minWidth: 100 }}> Sr No.</TableCell>
                      <TableCell sx={{ minWidth: 250 }}>Placed time</TableCell>
                      <TableCell sx={{ minWidth: 250 }}>Item name</TableCell>
                      <TableCell sx={{ minWidth: 250 }}>Quantity</TableCell>
                      <TableCell sx={{ minWidth: 100 }}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                </Table>
                {orders.map((x, ind) => (
                  // <TableRow key={ind}>
                  <Card sx={{ display: "flex" }} key={x._id}>
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
                        <Grid item>
                          <Typography component="div" variant="h6">
                            {x.quantity}
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography component="div" variant="h6">
                            {x.stage}
                          </Typography>
                          {x.stage === "PLACED" ? (
                            <>
                              <Button onClick={nextStage} id={x._id}>
                                MOVE TO NEXT STAGE
                              </Button>
                              <Button onClick={reject} id={x._id}>
                                REJECT
                              </Button>
                            </>
                          ) : (
                            [
                              x.stage === "REJECTED" ||
                              x.stage === "READY FOR PICKUP" ||
                              x.stage === "COMPLETED" ? (
                                <></>
                              ) : (
                                <Button onClick={nextStage} id={x._id}>
                                  MOVE TO NEXT STAGE
                                </Button>
                              ),
                            ]
                          )}
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                ))}
              </Paper>
            </ListItem>
          </List>
        </Grid>
      </Grid>
    </div>
  );
};

export default Vendor;
