import React from "react";
import NavBar from "../components/Content/nav";
import CoronaHotelSection from "../components/Content/corona_hotel_section";
import CornaHotelAbout from "../components/Content/corona_hotel_about";

class CoronaHotel extends React.Component {
  render() {
    return (
      <>
        <NavBar />
        <CoronaHotelSection/>
        <CornaHotelAbout/>
      </>
    );
  }
}

export default CoronaHotel;
