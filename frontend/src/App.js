import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import "./App.css";

import Buyer from "./components/users/Buyer";
import Vendor from "./components/users/Vendor";
import Home from "./components/common/Home";
import Register from "./components/common/Register";
import Order from "./components/common/orders";
import Stats from "./components/common/stats";
import Edit from "./components/common/edit";
import Wallet from "./components/common/wallet";
import SignIn from "./components/common/login";
import Navbar from "./components/templates/Navbar";
import PreNavbar from "./components/templates/preNavbar";
import Redirect from "./components/templates/redirect";
// import NewItem from "./components/templates/newitem";
import Profile from "./components/users/Profile";

const Layout1 = () => {
  return (
    <div>
      <PreNavbar />
      <div className="container">
        <Outlet />
      </div>
    </div>
  );
};

const Layout = () => {
  return (
    <div>
      <Navbar />
      <div className="container">
        <Outlet />
      </div>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="register" element={<Register />} />
        <Route path="/login" element={<Layout />}>
          <Route path="redirect" element={<Redirect />} />
          <Route path="user" element={<Buyer />} />
          <Route path="edit" element={<Edit />} />
          <Route path="vendor" element={<Vendor />} />
          <Route path="wallet" element={<Wallet />} />
          <Route path="orders" element={<Order />} />
          <Route path="stats" element={<Stats />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
