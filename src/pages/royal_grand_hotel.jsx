import React from "react";
import NavBar from "../components/Content/nav";
import RoyalGrandSection from "../components/Content/royalGrand_section";
import AboutUs from "../components/Content/royal_grand_about";
// import img1 from "../assets/images/Z (6).jpeg";

class RoyalGrandHotel extends React.Component {
  render() {
    return (
      <>
        <NavBar />
        <RoyalGrandSection />
        <AboutUs />
      </>
    );
  }
}

export default RoyalGrandHotel;
