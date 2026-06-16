import React from "react";
import NavBar from "../components/Content/nav";
import BellaCassaHotelSection from "../components/Content/bella_cassa_hotel_section";
import BellaCassaAbout from "../components/Content/bella_cassa_about";

class BellaCasaHotel extends React.Component {
  render() {
    return (
      <>
        <NavBar />
              
        <BellaCassaHotelSection/>
        <BellaCassaAbout/>
        </>
    );
  }
}

export default BellaCasaHotel;
