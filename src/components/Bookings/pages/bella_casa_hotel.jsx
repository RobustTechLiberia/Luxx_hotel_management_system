import React from "react";
import NavBar from "../Content/nav";
import BellaCassaHotelSection from "../Content/bella_cassa_hotel_section";
import BellaCassaAbout from "../Content/bella_cassa_about";

class BellaCasaHotel extends React.Component {
  render() {
    return (
      <>
        {!this.props.hideNavBar && <NavBar />}
              
        <BellaCassaHotelSection/>
        <BellaCassaAbout/>
        </>
    );
  }
}

export default BellaCasaHotel;
