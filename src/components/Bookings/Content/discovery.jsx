import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faStar } from "@fortawesome/free-solid-svg-icons";

import img1 from "../../../assets/images/Z (6).jpeg";
import img2 from "../../../assets/images/9k= (9).jpeg";
import img3 from "../../../assets/images/2Q== (12).jpeg";
import img4 from "../../../assets/images/2Q== (24).jpeg";
import img5 from "../../../assets/images/2Q== (11).jpeg";
import img6 from "../../../assets/images/2Q== (9).jpeg";

class Discover extends React.Component {
  constructor(props) {
    super(props);

    this.hotels = [
      {
        name: "Royal Grand Hotel",
        path: "/bookings/royal-grand-hotel",
        img: img1,
        location: "12 Street, Sinkor",
        price: "$5 per night",
        stars: 4,
      },
      {
        name: "Corona Hotel",
        path: "/bookings/corona-hotel",
        img: img2,
        location: "24 Street, Sinkor",
        price: "",
        stars: 5,
      },
      {
        name: "Boluvard Palace",
        path: "/bookings/boluvard-palace",
        img: img3,
        location: "12 Street, Sinkor",
        price: "",
        stars: 3,
      },
      {
        name: "Bella Casa Hotel",
        path: "/bookings/bella-casa-hotel",
        img: img4,
        location: "3rd Street, Sinkor",
        price: "",
        stars: 4,
      },
      {
        name: "Sinkor Palace Hotel",
        path: "/bookings/sinkor-palace-hotel",
        img: img5,
        location: "Congo Town",
        price: "",
        stars: 5,
      },
      {
        name: "Fammington Hotel",
        path: "/bookings/fammington-hotel",
        img: img6,
        location: "12 Street, Sinkor",
        price: "",
        stars: 3,
      },
    ];
  }

  handleHotelClick = async (hotelName) => {
    try {
      await fetch("http://localhost:8080/bookings/hotel-click", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ hotelName }),
      });
    } catch (error) {
      console.error("Failed to save hotel click:", error);
    }
  };

  renderStars = (count) => {
    return Array.from({ length: count }).map((_, i) => (
      <FontAwesomeIcon
        key={i}
        icon={faStar}
        className="text-lg text-amber-500"
      />
    ));
  };

  renderHotelCard = (hotel, index) => {
    return (
      <div key={index} className="bg-white w-full h-auto">
        <div className="w-full h-auto">
          <img
            src={hotel.img}
            alt={hotel.name}
            className="object-cover w-full h-52 sm:h-56 md:h-60"
          />
        </div>

        <div className="text-lg py-5 font-sans text-left capitalize font-medium">
          <Link
            to={hotel.path}
            onClick={() => this.handleHotelClick(hotel.name)}
          >
            {hotel.name}
          </Link>

          <div className="text-sm font-normal mt-1">
            <div className="flex justify-between">
              <span>{hotel.location}</span>
              {hotel.price && <span>{hotel.price}</span>}
            </div>
          </div>
        </div>

        <div className="flex gap-1">{this.renderStars(hotel.stars)}</div>
      </div>
    );
  };

  render() {
    return (
      <>
        {/* HEADER */}
        <div
          className="bg-white h-auto md:mb-20 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8"
          id="discover"
        >
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold capitalize">
              Discover Hotels
            </h1>

            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faFilter} />
              <select className="border-none text-sm">
                <option>Sort prices</option>
                <option>High</option>
                <option>Lowest</option>
              </select>
            </div>
          </div>

          {/* GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
            {this.hotels.map((hotel, index) =>
              this.renderHotelCard(hotel, index),
            )}
          </div>
        </div>
      </>
    );
  }
}

export default Discover;
