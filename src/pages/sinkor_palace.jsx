import React from "react";
import NavBar from "../components/Content/nav";
import SinkorPalaceAbout from "../components/Content/sinkor_palace_hotel_about";
import SinkorPalaceSection from "../components/Content/sinkor_palace_section";

class SinkorPalaceHotel extends React.Component {
  render() {
    return (
      <>
        <NavBar />
        
        <SinkorPalaceSection/>
        <SinkorPalaceAbout/>
              </>
    );
  }
}

export default SinkorPalaceHotel;
