import { useNavigate } from "react-router-dom";
import * as React from "react";
import { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { Avatar } from "@mui/material";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
import { Tooltip } from "@mui/material";
import Divider from "@mui/material/Divider";

const darkTheme = createTheme({ palette: { mode: "dark" } });

const Navbar = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [wallet, setWallet] = useState();
  const open = Boolean(anchorEl);

  useEffect(() => {
    setWallet(localStorage.getItem("Wallet"));
  }, []);
  const profile = () => {
    window.location.href = "/login/edit";
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ cursor: "pointer" }}>
            Canteen Portal
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          {localStorage.getItem("User") === "Buyer" ? (
            <>
              <Tooltip title="Go to home">
                <Button color="inherit" onClick={() => navigate("/login/user")}>
                  Home
                </Button>
              </Tooltip>
              <Tooltip title="Manage orders">
                <Button
                  color="inherit"
                  onClick={() => navigate("/login/orders")}
                >
                  My Orders
                </Button>
              </Tooltip>
              <Tooltip title="My wallet">
                <Button
                  color="inherit"
                  onClick={() => navigate("/login/wallet")}
                  sx={{ paddingLeft: 3 }}
                >
                  <AccountBalanceWalletIcon sx={{ fontSize: 40 }} /> :{wallet}
                </Button>
              </Tooltip>
            </>
          ) : (
            <>
              <Tooltip title="Go to home">
                <Button
                  color="inherit"
                  onClick={() => navigate("/login/vendor")}
                >
                  Home
                </Button>
              </Tooltip>
              <Tooltip title="View stats">
                <Button
                  color="inherit"
                  onClick={() => navigate("/login/stats")}
                  sx={{ paddingLeft: 3 }}
                >
                  Statistics
                </Button>
              </Tooltip>
            </>
          )}
          <Button
            color="inherit"
            sx={{ paddingLeft: 3 }}
            id="composition-button"
            aria-controls={open ? "composition-menu" : undefined}
            aria-expanded={open ? "true" : undefined}
            aria-haspopup="true"
            onClick={handleClick}
          >
            <Avatar />
          </Button>

          <Paper>
            <Menu
              autoFocusItem={open}
              id="composition-menu"
              aria-labelledby="composition-button"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
            >
              <MenuItem onClick={profile}>Profile</MenuItem>
              <Divider />
              <MenuItem onClick={logout}>Logout</MenuItem>
            </Menu>
          </Paper>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
