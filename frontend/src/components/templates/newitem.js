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
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import CloseIcon from "@mui/icons-material/Close";

function valuetext(value) {
  return `${value}`;
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const tags = ["Drinks", "Snacks", "Meals", "Sweet", "Spicy", "Cold", "Hot"];

const shops = ["BBC", "VC", "JC"];

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const NewItem = (props) => {
  const navigate = useNavigate();
  if (localStorage.getItem("Token") == null) {
    window.location.href = "/login/redirect";
  }
  const theme = useTheme();
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [sortedItems, setSortedItems] = useState([]);
  const [sortPrice, setSortPrice] = useState(true);
  const [sortRating, setSortRating] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [price, setPrice] = React.useState();
  const [tag, setTag] = React.useState([]);
  const [shop, setShop] = React.useState("");
  const [veg, setVeg] = useState(true);
  const [addons, setFields] = useState([]);
  const [image, setImage] = useState();

  function handleChangeName(i, event) {
    const values = [...addons];
    values[i].name = event.target.value;
    // values[i].price = event.target.value;
    setFields(values);
  }

  function handleChangePrice(i, event) {
    const values = [...addons];
    // values[i].name = event.target.value;
    values[i].price = event.target.value;
    setFields(values);
  }

  function handleAdd() {
    const values = [...addons];
    values.push({ name: "", price: null });
    setFields(values);
  }

  function handleRemove(i) {
    const values = [...addons];
    values.splice(i, 1);
    setFields(values);
  }

  const onChangeVeg = (event) => {
    setVeg(!veg);
  };

  const onChangePrice = (event) => {
    setPrice(event.target.value);
  };

  const onChangeName = (event) => {
    setName(event.target.value);
  };

  const addTag = (event) => {
    const {
      target: { value },
    } = event;
    setTag(typeof value === "string" ? value.split(",") : value);
  };

  const onChangeShop = (event) => {
    setShop(event.target.value);
  };

  const resetInputs = () => {
    setName("");
    setPrice();
    setTag([]);
    setShop("");
    setVeg(true);
    setFields([{ name: "", price: null }]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // const formData = new FormData();
    // formData.append("avatar", image);
    // formData.append("name", name);
    // formData.append("price", price);
    // formData.append("veg", veg);
    // formData.append("shop", shop);
    // formData.append("addons", addons);
    // formData.append("image", image);
    // formData.append("tag", tag);
    // formData.append("__vendorID", localStorage.getItem("Token"));
    const formData = {
      avatar: image,
      name: name,
      price: price,
      veg: veg,
      shop: shop,
      addons: addons,
      // image: image,
      vendorname: localStorage.getItem("Name"),
      tag: tag,
      __vendorID: localStorage.getItem("Token"),
    };
    axios
      .post("http://localhost:4000/api/user/newitem", formData)
      .then((response) => {
        alert(
          "Created item " +
            response.data +
            " for vendor " +
            localStorage.getItem("Name")
        );
        console.log(response.data);
      });

    resetInputs();
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
          <RestaurantIcon sx={{ fontSize: 50 }} />
          <Typography component="h1" variant="h5">
            New Item
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="itemName"
                  required
                  fullWidth
                  id="itemName"
                  value={name}
                  onChange={onChangeName}
                  label="Item Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  value={price}
                  onChange={onChangePrice}
                  id="price"
                  label="Item Price"
                  name="price"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  sx={{ paddingLeft: 10 }}
                  control={
                    <Checkbox
                      sx={{
                        color: green[800],
                        "&.Mui-checked": { color: green[600] },
                      }}
                      checked={veg}
                      onChange={onChangeVeg}
                    />
                  }
                  label="Veg"
                />
                <FormControlLabel
                  sx={{ paddingLeft: 10 }}
                  control={
                    <Checkbox
                      sx={{
                        color: red[800],
                        "&.Mui-checked": { color: red[600] },
                      }}
                      checked={!veg}
                      onChange={onChangeVeg}
                    />
                  }
                  label="Non-Veg"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  select
                  onChange={onChangeShop}
                  label="Shop"
                  id="shop"
                  name="shop"
                  value={shop}
                >
                  <MenuItem value={"BBC"}>BBC</MenuItem>
                  <MenuItem value={"JC"}>JC</MenuItem>
                  <MenuItem value={"VC"}>VC</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <InputLabel id="demo-multiple-chip-label">Tags</InputLabel>
                <Select
                  labelId="demo-multiple-chip-label"
                  id="demo-multiple-chip"
                  multiple
                  value={tag}
                  onChange={addTag}
                  fullWidth
                  sx={{ mb: 0.5 }}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                  MenuProps={MenuProps}
                >
                  {tags.map((name) => (
                    <MenuItem
                      key={name}
                      value={name}
                      style={getStyles(name, tag, theme)}
                    >
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>

              <Grid>
                {addons.map((field, idx) => {
                  return (
                    <div key={`${field}-${idx}`}>
                      <Grid container sx={{ paddingLeft: 6, marginTop: 2 }}>
                        <Grid item>
                          <TextField
                            label="addons"
                            onChange={(e) => handleChangeName(idx, e)}
                            value={addons[idx].name}
                            sx={{ maxWidth: 150 }}
                          ></TextField>
                        </Grid>
                        <Grid item>
                          <TextField
                            label="Price"
                            onChange={(e) => handleChangePrice(idx, e)}
                            value={addons[idx].price}
                            sx={{ maxWidth: 150 }}
                          ></TextField>
                        </Grid>
                        <Grid item>
                          <Button
                            onClick={() => handleRemove(idx)}
                            sx={{ color: red[800] }}
                          >
                            <CloseIcon />
                          </Button>
                        </Grid>
                      </Grid>
                    </div>
                  );
                })}
              </Grid>
              <Grid item marginLeft={17}>
                <Button onClick={() => handleAdd()} variant="contained">
                  Add addon
                </Button>
              </Grid>
              {/* <Grid item>
                <Button variant="contained" component="label">
                  Upload Image
                  <input
                    type="file"
                    hidden
                    onChange={(e) => {
                      setImage(e.target.files[0]);
                    }}
                    name="avatar"
                  />
                </Button>
              </Grid> */}
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Add Item
            </Button>
          </Box>
        </Box>
      </Container>
    </div>
  );
};

export default NewItem;
