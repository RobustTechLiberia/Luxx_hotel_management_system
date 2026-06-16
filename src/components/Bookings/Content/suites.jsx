import React from "react";
import img1 from "../../../assets/images/2Q== (18).jpeg";
import img2 from "../../../assets/images/Z (17).jpeg";
import img3 from "../../../assets/images/Z (18).jpeg";
import Footer from "./footer";

class RoomSuites extends React.Component {
  render() {
    return (
      <>
        <div className="flex flex-wrap justify-center">
          <h1 className="text-3xl font-sans font-semibold  my-8 capitalize">
            room &amp; suites
          </h1>
        </div>
        <div className="mt-8 flex flex-col items-center justify-evenly gap-10 px-4 sm:px-6 md:mt-8 md:h-96 md:flex-row md:flex-wrap md:justify-center md:gap-8 md:px-0">
          <div className="w-full max-w-sm md:w-72 md:max-w-none">
            <img
              src={img1}
              alt="family bed"
              className="h-56 w-full object-cover sm:h-64 md:h-44"
            />
            <div className="flex justify-center py-3 capitalize font-sans">
              family bed
            </div>
          </div>
          <div className="w-full max-w-sm md:w-72 md:max-w-none">
            <img
              src={img2}
              alt="single bed"
              className="h-56 w-full object-cover sm:h-64 md:h-44"
            />
            <div className="flex  justify-center py-3 capitalize font-sans">
              single bed
            </div>
          </div>
          <div className="w-full max-w-sm md:w-72 md:max-w-none">
            <img
              src={img3}
              alt="Double Bed"
              className="h-56 w-full object-cover sm:h-64 md:h-44"
            />
            <div className="flex justify-center py-3 capitalize font-sans">
              double bed
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }
}

export default RoomSuites;
