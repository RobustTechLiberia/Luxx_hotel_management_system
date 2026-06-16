import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBed,
  faLocationDot,
  faSnowflake,
} from "@fortawesome/free-solid-svg-icons";
import img2 from "../../../assets/images/Z (18).jpeg";
import img3 from "../../../assets/images/9k= (18).jpeg";
import img4 from "../../../assets/images/Z (16).jpeg";

import img1 from "../../../assets/images/9k= (9).jpeg";


class CoronaHotelSection extends React.Component{

    render(){

        return(

            <>
             <div className="mt-20 flex flex-col justify-evenly gap-8 bg-white px-4 sm:px-6 md:mx-20 md:mt-28 md:flex-row md:gap-10 md:px-0">
                      <div className="mx-auto w-full max-w-2xl bg-white md:mx-2 md:mt-0 md:max-w-lg">
                        <img
                          src={img1}
                          alt="royal grand hotel"
                          className="h-64 w-full object-cover rounded-none sm:h-80 md:h-96 md:w-auto"
                        />
                        <div className="my-5 flex flex-wrap justify-start gap-4 md:my-10 md:gap-2">
                          <div className="w-[30%] min-w-24 sm:w-28">
                            <img src={img2} alt="" className="h-20 w-full object-cover md:rounded-none" />
                          </div>
                          <div className="w-[30%] min-w-24 sm:w-28">
                            <img src={img3} alt="" className="h-20 w-full object-cover md:rounded-none" />
                          </div>
                          <div className="w-[30%] min-w-24 sm:w-28">
                            <img src={img4} alt="" className="h-20 w-full object-cover md:rounded-none" />
                          </div>
                        </div>
                      </div>
                      <div className="w-full max-w-lg bg-white">
                        <div className="mx-auto h-auto w-full border-none bg-white px-1 md:mx-5 md:h-96 md:w-96 md:px-0 md:shadow-none">
                          <h1 className="text-left font-sans text-2xl capitalize font-semibold  my-2">
                            corona hotel
                          </h1>
                          <p className="text-left font-sans py-3  text-sm capitalize">
                            <FontAwesomeIcon
                              icon={faLocationDot}
                              className="mr-2 text-black"
                            />
                            : 24 street sinkor <br /> monrovia, liberia
                          </p>
                          {/* contact */}
                          <p className="text-left font-sans py-2 text-sm capitalize">
                            <FontAwesomeIcon
                              icon={faSnowflake}
                              className="mr-2 text-black"
                            />
                            : fully cool
                          </p>
                          {/* bed rooms */}
                          <p className="text-left font-sans py-2 text-sm capitalize">
                            <FontAwesomeIcon icon={faBed} className="mr-2 text-black" />:
                            150 bed rooms
                          </p>
                          <div className="my-2 flex flex-wrap justify-start md:mt-8">
                            <Link
                              to="/bookings/corona-hotel"
                              className="px-8 py-3 font-semibold text-lg uppercase rounded-none bg-amber-500"
                            >
                              book now
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
            </>
        );
    }
}

export default CoronaHotelSection;
