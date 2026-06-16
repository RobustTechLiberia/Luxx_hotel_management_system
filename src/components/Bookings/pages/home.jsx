import React from "react";
import NavBar from "./nav";
import Banner from "./banner";
import Filtering from "./filtering_section";
import TopHotels from "./hotel_listing";
import Discover from "./discovery";
import Footer from "./footer";

class HomePage extends React.Component {
  render() {
    return (
      <>
        <NavBar />
        <Banner />
        <Filtering />
        <TopHotels />
        <Discover />
        <Footer />
      </>
    );
  }
}

export default HomePage;
