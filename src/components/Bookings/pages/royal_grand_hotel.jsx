import React from "react";
import NavBar from "../Content/nav";
import RoyalGrandSection from "../Content/royalGrand_section";
import AboutUs from "../Content/royal_grand_about";
// import img1 from "../assets/images/Z (6).jpeg";

class RoyalGrandHotel extends React.Component {
  render() {
    return (
      <>
        {!this.props.hideNavBar && <NavBar />}
        <RoyalGrandSection />
        <AboutUs />
      </>
    );
  }
}

export default RoyalGrandHotel;
