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
import Container from "@mui/material/Container";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import Button from "@mui/material/Button";
import Rating from "@mui/material/Rating";
import TextField from "@mui/material/TextField";
import FormGroup from "@mui/material/FormGroup";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
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
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Tooltip } from "@mui/material";
import Divider from "@mui/material/Divider";
import { red, green } from "@mui/material/colors";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import SearchIcon from "@mui/icons-material/Search";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import FilterCenterFocusOutlinedIcon from "@mui/icons-material/FilterCenterFocusOutlined";
import { formatDistanceToNowStrict } from "date-fns/esm";
import Buy from "../templates/buy";
import { fil } from "date-fns/locale";
import Fuse from "fuse.js";

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

const Buyer = (props) => {
  const navigate = useNavigate();
  if (localStorage.getItem("Token") == null) {
    window.location.href = "/login/redirect";
  }
  const theme = useTheme();
  const [items, setItems] = useState([]);
  const [sortedItems, setSortedItems] = useState([]);
  const [sortPrice, setSortPrice] = useState(true);
  const [sortRating, setSortRating] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [veg, setVeg] = useState(false);
  const [nonveg, setNonVeg] = useState(false);
  const [value, setValue] = React.useState([0, 500]);
  const [tag, setTag] = React.useState([]);
  const [shop, setShop] = React.useState([]);
  const [foods, setFoods] = useState(new Set());
  const [favs, setFavs] = useState([]);
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    axios
      .post("http://localhost:4000/api/user/buyeritems", {
        email: localStorage.getItem("Email"),
      })
      .then((response) => {
        console.log(response.data);
        setFoods(response.data);
        setItems(response.data);
        // setItems(response.data);
        // setSortedItems(response.data);
        // setSearchText("");
      })
      .catch((error) => {
        console.log(error);
      });
    axios
      .post("http://localhost:4000/api/user/favsget", {
        email: localStorage.getItem("Email"),
      })
      .then((response) => {
        console.log(response.data);
        setFavs([...new Set(response.data)]);
        // setItems(response.data);
        // setSortedItems(response.data);
        // setSearchText("");
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    let filterItems = [...foods];
    if (!nonveg && veg) {
      filterItems = foods.filter((food) => food.veg);
    } else if (!veg && nonveg) {
      filterItems = foods.filter((food) => !food.veg);
    }
    filterItems = filterItems.filter(
      (item) => item.price >= value[0] && item.price <= value[1]
    );
    if (tag.length) {
      filterItems = filterItems.filter((item) => {
        let found = false;
        item.tags.forEach((tagx) => {
          const includeItem = tag.includes(tagx);
          if (includeItem) found = true;
        });
        return found;
      });
    }
    if (shop.length) {
      filterItems = filterItems.filter((item) => shop.includes(item.shop));
    }

    const fuse = new Fuse(filterItems, {
      keys: ["name"],
    });
    if (searchText.trim()) {
      const bigboobass = fuse.search(searchText);
      filterItems = bigboobass.map((food) => food.item);
    }
    setItems(filterItems);
  }, [veg, nonveg, value, tag, shop, searchText]);

  const onAddFavs = (event) => {
    const x = favs.find((fav) => fav._id === event.target.id);
    if (x) {
      return;
    }
    const newFavs = [
      ...favs,
      foods.find((food) => food._id === event.target.id),
    ];
    // console.log(newFavs);
    setFavs(newFavs);
    axios
      .post("http://localhost:4000/api/user/favssend", {
        id: localStorage.getItem("Token"),
        favs: newFavs,
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onRemoveFavs = (event) => {
    const newFavs = favs.filter((food) => food._id !== event.target.id);
    setFavs(newFavs);
    axios
      .post("http://localhost:4000/api/user/favssend", {
        id: localStorage.getItem("Token"),
        favs: newFavs,
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleClickOpen = (event) => {
    localStorage.setItem("Item", event.target.id);
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

  const tagDelete = (event) => {
    console.log(event.target);
    setTag((chips) => chips.filter((chip) => chip.key !== event.key));
  };

  const shopDelete = (event) => {
    console.log(event.key);
    setShop((chips) => chips.filter((chip) => chip.key !== event.key));
  };

  const addShop = (event) => {
    const {
      target: { value },
    } = event;
    setShop(typeof value === "string" ? value.split(",") : value);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const sortp = () => {
    let itemsTemp = items;
    const flag = sortPrice;
    itemsTemp.sort((a, b) => {
      if (a.price !== undefined && b.price !== undefined) {
        return (1 - flag * 2) * (a.price - b.price);
      } else {
        return 1;
      }
    });
    setItems(itemsTemp);
    setSortPrice(!sortPrice);
  };

  const sortr = () => {
    let itemsTemp = items;
    const flag = sortRating;
    itemsTemp.sort((a, b) => {
      if (a.rating !== undefined && b.rating !== undefined) {
        return (1 - flag * 2) * (a.rating - b.rating);
      } else {
        return 1;
      }
    });
    setItems(itemsTemp);
    setSortRating(!sortRating);
  };

  const onSearch = (event) => {
    setSearchText(event.target.value);
  };

  return (
    <div>
      <Grid container>
        <Grid item xs={12} md={3} lg={3}>
          <List component="nav" aria-label="mailbox folders">
            <ListItem text>
              <h1>Filters</h1>
            </ListItem>
          </List>
        </Grid>
        <Grid item xs={12} md={9} lg={9} sx={{ maxHeight: 10 }}>
          <List component="nav" aria-label="mailbox folders">
            <TextField
              id="standard-basic"
              label="Search"
              fullWidth={true}
              value={searchText}
              onChange={onSearch}
              InputProps={{
                endAdornment: (
                  <InputAdornment>
                    <IconButton>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </List>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={12} md={3} lg={3}>
          <List component="nav" aria-label="mailbox folders">
            <ListItem divider>
              <Box sx={{ width: 300 }}>
                <Typography id="input-slider" gutterBottom>
                  Price Range:
                </Typography>
                <Slider
                  getAriaLabel={() => "Price range"}
                  value={value}
                  min={0}
                  max={500}
                  onChange={handleChange}
                  valueLabelDisplay="auto"
                  getAriaValueText={valuetext}
                />
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      id="standard-basic"
                      label="Enter Min"
                      value={value[0]}
                      fullWidth={true}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <TextField
                      id="standard-basic1"
                      label="Enter Max"
                      value={value[1]}
                      fullWidth={true}
                    />
                  </Grid>
                </Grid>
              </Box>
            </ListItem>
            <ListItem divider sx={{ marginLeft: 0 }}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      sx={{
                        color: green[800],
                        "&.Mui-checked": { color: green[600] },
                      }}
                      checked={veg}
                      onChange={() => setVeg(!veg)}
                    />
                  }
                  label="Veg"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      sx={{
                        color: red[800],
                        "&.Mui-checked": { color: red[600] },
                      }}
                      checked={nonveg}
                      onChange={() => setNonVeg(!nonveg)}
                    />
                  }
                  label="Non-Veg"
                />
              </FormGroup>
            </ListItem>
            <ListItem divider sx={{ marginTop: 0.5 }}>
              <InputLabel id="demo-multiple-chip-label">Tags</InputLabel>
              <Select
                labelId="demo-multiple-chip-label"
                id="demo-multiple-chip"
                multiple
                value={tag}
                onChange={addTag}
                sx={{ minWidth: 200, marginLeft: 2, mb: 0.5 }}
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
              {/* <Autocomplete
                id="combo-box-demo"
                options={users}
                getOptionLabel={(option) => option.name}
                fullWidth
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Names"
                    variant="outlined"
                  />
                )}
              /> */}
            </ListItem>
            <ListItem divider sx={{ mt: 0.5 }}>
              <InputLabel id="shop-multiple-chip-label">Shops</InputLabel>
              <Select
                labelId="shop-multiple-chip-label"
                id="shop-multiple-chip"
                multiple
                value={shop}
                onChange={addShop}
                sx={{ minWidth: 200, marginLeft: 0.5, mb: 0.5 }}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
                MenuProps={MenuProps}
              >
                {shops.map((name) => (
                  <MenuItem
                    key={name}
                    value={name}
                    style={getStyles(name, tag, theme)}
                  >
                    {name}
                  </MenuItem>
                ))}
              </Select>
              {/* <Autocomplete
                id="combo-box-demo"
                options={users}
                getOptionLabel={(option) => option.name}
                fullWidth
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Names"
                    variant="outlined"
                  />
                )}
              /> */}
            </ListItem>
          </List>
        </Grid>
        <Grid item xs={12} md={9} lg={9}>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            component="div"
            sx={{ fontSize: 20 }}
          >
            Favourites:
          </Typography>
          <Container
            style={{
              display: "flex",
              flexDirection: "row",
              overflowX: "scroll",
              maxWidth: "100%",
              padding: 1,
            }}
          >
            {favs.map((x, ind) => (
              // <TableRow key={ind}>
              // <Grid item>
              <Card
                key={x._id}
                style={{
                  height: "8rem",
                  minWidth: "12rem",
                  margin: "0 0.1rem",
                }}
              >
                <CardContent sx={{ flex: "1 0 auto" }}>
                  <Typography gutterBottom variant="h5" component="div">
                    {x.name}
                  </Typography>
                  <Button name="jddjosjdoo" id={x._id} onClick={onRemoveFavs}>
                    {/* <FavoriteBorderOutlinedIcon /> */}
                    Remove from Favs
                  </Button>
                </CardContent>
              </Card>
              // </Grid>
            ))}
          </Container>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            component="div"
            sx={{ fontSize: 20 }}
          >
            Results:
          </Typography>
          <Paper>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>
                    {" "}
                    <Button onClick={sortp}>
                      {sortPrice ? <ArrowDownwardIcon /> : <ArrowUpwardIcon />}
                    </Button>
                    Price
                  </TableCell>
                  <TableCell>Vendor</TableCell>
                  <TableCell>
                    {" "}
                    <Button onClick={sortr}>
                      {sortRating ? <ArrowDownwardIcon /> : <ArrowUpwardIcon />}
                    </Button>
                    Rating
                  </TableCell>
                </TableRow>
              </TableHead>
            </Table>
            {items.map((x, ind) => (
              <Card sx={{ display: "flex" }} key={x._id}>
                <CardContent sx={{ flex: "1 0 auto" }}>
                  <Grid
                    container
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Grid item sx={{ display: "flex", width: 200 }}>
                      <Typography component="div" variant="h6">
                        {x.name}
                      </Typography>
                      {x.veg ? (
                        <FilterCenterFocusOutlinedIcon
                          sx={{ color: green[800], fontSize: 30 }}
                        />
                      ) : (
                        <FilterCenterFocusOutlinedIcon
                          sx={{ color: red[800], fontSize: 30 }}
                        />
                      )}
                    </Grid>
                    <Grid item sx={{ width: 240 }}>
                      <Typography
                        variant="subtitle1"
                        color="text.secondary"
                        component="div"
                        sx={{ fontSize: 20 }}
                      >
                        {x.price}
                      </Typography>
                    </Grid>
                    <Grid item>{x.vendorname}</Grid>
                    <Grid item sx={{ width: 200 }}>
                      <Rating
                        name="read-only"
                        value={x.rating}
                        readOnly
                        sx={{ fontSize: 20 }}
                      />
                    </Grid>
                    <Grid item>
                      <Button name="jddjosjdoo" id={x._id} onClick={onAddFavs}>
                        Add to Favs
                      </Button>
                      <Button onClick={handleClickOpen} id={x._id}>
                        Buy
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}
          </Paper>
          <Dialog open={open} onClose={handleClose}>
            <Buy />
          </Dialog>
        </Grid>
      </Grid>
    </div>
  );
};

export default Buyer;
