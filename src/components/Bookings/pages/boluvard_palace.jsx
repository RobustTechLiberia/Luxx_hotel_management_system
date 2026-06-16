import React from "react";
import NavBar from "../Content/nav";
import BouluvardHotelAbout from "../Content/boluvard_hotel_about";
import BoluvardHotelSection from "../Content/boluvard_hotel_section";

class BoluvardPalaceHotel extends React.Component {
  render() {
    return (
      <>
        {!this.props.hideNavBar && <NavBar />}
        <BoluvardHotelSection/>
       <BouluvardHotelAbout/>
      </>
    );
  }
}

export default BoluvardPalaceHotel;
