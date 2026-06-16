import React from "react";
import Login from "../Dashboard/Forms/login";
import Nav from "./nav";

class Default extends React.Component {
  render() {
    return (
      <>
        <Nav />
        <div className="md:my-20 bg-white">
          <Login />
        </div>
      </>
    );
  }
}

export default Default;
