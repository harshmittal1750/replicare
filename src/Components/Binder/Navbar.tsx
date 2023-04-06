import Sidebar from "../Sidebar";
// import ConnectionWallet from "../ConnectionWallet";
import { Link } from "react-router-dom";
import ConnectWalletPopUp from "../ConnectWalletPopUp";
import { AppBar, Toolbar, Typography } from "@mui/material";
// import logo from "../../../public/logo.png";
const Navbar = () => {
  return (
    <div>
      <AppBar position="relative">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Sidebar />
          {/* <Button sx={{ color: "#ffffff" }}>Signup</Button> */}
          <Link to="/" style={{ textDecoration: "none", color: "#222629" }}>
            <Typography
              variant="h4"
              color="inherit"
              noWrap
              justifyContent={"center"}
            >
              Replicare
            </Typography>
            {/* <img style={{ width: "10%" }} src={logo} alt="logo" /> */}
          </Link>
          {/* <ConnectionWallet /> */}
          <ConnectWalletPopUp />
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Navbar;