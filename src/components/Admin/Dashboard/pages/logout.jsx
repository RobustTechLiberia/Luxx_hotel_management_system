import React from "react";
import { Navigate } from "react-router-dom";

class Logout extends React.Component {
  componentDidMount() {
    // clear any auth tokens stored in localStorage or cookies
    try {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("username");
      localStorage.removeItem("email");
    } catch (e) {
      // ignore
    }
  }

  render() {
    // redirect to login page
    return <Navigate to="/login" replace />;
  }
}

export default Logout;
