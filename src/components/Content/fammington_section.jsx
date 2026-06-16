import React from "react";
import RoomSuites from "./suites";

import img1 from "../../assets/images/2Q== (9).jpeg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCar,
  faSwimmer,
  faWifiStrong,
} from "@fortawesome/free-solid-svg-icons";

class FammingtonAbout extends React.Component{

    render(){

        return(
            <>
            <div className="bg-white flex flex-col md:flex-row justify-evenly gap-6 md:gap-8 px-4 sm:px-6 md:px-0 py-6 md:py-0">
                      <div className="w-full md:w-1/2 max-w-2xl mx-auto md:mx-0">
                        <h1 className="text-2xl font-sans capitalize mx-2 sm:mx-6 md:mx-20 md:py-3 font-semibold text-left">
                          about us
                        </h1>
                        <p className="text-left font-sans mx-2 sm:mx-6 md:mx-20 py-2">
                          Integer suscipit placerat nulla viverra ornare pariatur tellus
                          doloremque perferendis doloremque per semper rutrum praesentium,
                          tempor volutpat pede officiis et, tempus quasi porta rem! Ornare
                          ratione neque, nesciunt. Rerum beatae labore aspernatur adipisci!
                          {/* Dictumst cubilia eaque, veritatis quas saepe! Dolorum sociosqu
                          eros lacus commodo repellat asperiores sequi temporibus aspernatur
                          laboriosam senectus? Neque, laboriosam laudantium */}
                        </p>
                        {/* features */}
            
                        <div className="flex flex-wrap justify-start gap-6 md:gap-10 mx-2 sm:mx-6 md:ml-20 md:my-16 bg-white">
                          {/* wifi connection */}
                          <div className="w-24">
                            <FontAwesomeIcon
                              icon={faWifiStrong}
                              className="text-3xl text-black"
                            />
                            <br />
                            <p className="text-left font-sans capitalize text-sm mt-2 md:my-3">
                              wifi
                            </p>
                          </div>
                          {/* car parking */}
                          <div className="w-24">
                            <FontAwesomeIcon icon={faCar} className="text-3xl text-black" />
                            <br />
                            <p className="text-left font-sans capitalize text-sm mt-2 md:my-3">
                              parking lot
                            </p>
                          </div>
                          {/* swimming pool */}
                          <div className="w-24">
                            <FontAwesomeIcon
                              icon={faSwimmer}
                              className="text-3xl text-black"
                            />
                            <br />
                            <p className="text-left font-sans capitalize text-sm mt-2 md:my-3">
                              swimming pool
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="w-full md:w-1/2 max-w-lg mx-auto md:mx-0">
                        <img
                          src={img1}
                          alt=""
                          className="w-full h-64 md:h-80 object-cover"
                        />
                      </div>
                    </div>
                    <RoomSuites />
            </>
        );
    }
}

export default FammingtonAbout;