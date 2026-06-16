import React from "react";
import NavBar from "../components/Content/nav";
import Banner from "../components/Content/banner";
import Filtering from "../components/Content/filtering_section";
import TopHotels from "../components/Content/hotel_listing";
import Discover from "../components/Content/discovery";
import Footer from "../components/Content/footer";

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
