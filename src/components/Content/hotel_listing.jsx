import React from "react";
import img1 from "../../assets/images/9k= (9).jpeg";
import img2 from "../../assets/images/2Q== (12).jpeg";
import img3 from "../../assets/images/2Q== (11).jpeg";
class TopHotels extends React.Component {
  render() {
    return (
      <>
        {/* top hotels */}
        <div className="h-auto bg-white">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mt-10 sm:mt-12 mb-6 sm:mb-10 md:mb-12">
              <h1 className="capitalize text-center md:text-5xl text-3xl font-sans font-semibold">
                top hotels
              </h1>
            </div>
            <div className="mt-6 flex flex-nowrap gap-4 overflow-x-auto py-2 snap-x snap-mandatory sm:mt-4 sm:gap-6 lg:mt-0 lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible">
            <div className="flex h-72 w-[88%] min-w-[88%] shrink-0 snap-center justify-center sm:h-80 sm:w-[70%] sm:min-w-[70%] md:w-[55%] md:min-w-[55%] lg:h-96 lg:w-full lg:min-w-0">
              <span className="block w-full">
                <img
                  src={img2}
                  alt=""
                  className="h-full w-full object-cover lg:cursor-pointer lg:hover:scale-105"
                />
              </span>
            </div>
            <div className="flex h-72 w-[88%] min-w-[88%] shrink-0 snap-center justify-center sm:h-80 sm:w-[70%] sm:min-w-[70%] md:w-[55%] md:min-w-[55%] lg:h-[27rem] lg:w-full lg:min-w-0">
              <span className="block w-full">
                <img
                  src={img1}
                  alt=""
                  className="h-full w-full object-cover lg:cursor-pointer lg:rounded-none lg:hover:scale-105"
                />
              </span>
            </div>
            <div className="flex h-72 w-[88%] min-w-[88%] shrink-0 snap-center justify-center sm:h-80 sm:w-[70%] sm:min-w-[70%] md:w-[55%] md:min-w-[55%] lg:h-96 lg:w-full lg:min-w-0">
              <span className="block w-full">
                <img
                  src={img3}
                  alt=""
                  className="h-full w-full object-cover hover:cursor-pointer lg:rounded-none lg:hover:scale-105"
                />
              </span>
            </div>
          </div>
          </div>
        </div>
      </>
    );
  }
}

export default TopHotels;
