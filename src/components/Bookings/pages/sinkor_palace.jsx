import React from "react";
import NavBar from "../Content/nav";
import SinkorPalaceAbout from "../Content/sinkor_palace_hotel_about";
import SinkorPalaceSection from "../Content/sinkor_palace_section";

class SinkorPalaceHotel extends React.Component {
  render() {
    return (
      <>
        {!this.props.hideNavBar && <NavBar />}

        <SinkorPalaceSection />
        <SinkorPalaceAbout />
      </>
    );
  }
}

export default SinkorPalaceHotel;
