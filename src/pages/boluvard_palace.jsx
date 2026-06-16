import React from "react";
import NavBar from "../components/Content/nav";
import BouluvardHotelAbout from "../components/Content/boluvard_hotel_about";
import BoluvardHotelSection from "../components/Content/boluvard_hotel_section";

class BoluvardPalaceHotel extends React.Component {
  render() {
    return (
      <>
        <NavBar />
        <BoluvardHotelSection/>
       <BouluvardHotelAbout/>
      </>
    );
  }
}

export default BoluvardPalaceHotel;
