import React from "react";
import NavBar from "../Content/nav";
import CoronaHotelSection from "../Content/corona_hotel_section";
import CornaHotelAbout from "../Content/corona_hotel_about";

class CoronaHotel extends React.Component {
  render() {
    return (
      <>
        {!this.props.hideNavBar && <NavBar />}
        <CoronaHotelSection />
        <CornaHotelAbout />
      </>
    );
  }
}

export default CoronaHotel;
