import React from "react";
import NavBar from "../components/Content/nav";
import Fammington_Hotel_Section from "../components/Content/fammington_hotel_section";
import FammingtonAbout from  "../components/Content/fammington_section";

class FammingtonHotel extends React.Component {
  render() {
    return (
      <>
        <NavBar />
        <Fammington_Hotel_Section/>      
        <FammingtonAbout/>
        </>
    );
  }
}

export default FammingtonHotel;
