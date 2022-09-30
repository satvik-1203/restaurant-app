import { useNavigate } from "react-router-dom";

function Redirect() {
  //   const navigate = useNavigate();

  if (localStorage.getItem("Token") == null) {
    window.location.href = "/";
  } else {
    if (localStorage.getItem("User") === "Vendor") {
      window.location.href = "/login/vendor";
    } else {
      window.location.href = "/login/user";
    }
  }
}

export default Redirect;
