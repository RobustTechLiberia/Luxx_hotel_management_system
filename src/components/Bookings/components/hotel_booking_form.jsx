import React from "react";
import { Link, Navigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faEnvelope,
  faLocationDot,
  faMobileScreenButton,
} from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";
import NavBar from "../Content/nav";
import Suites from "../Content/suites";

// Fallback configuration automatically targeting your Cloudflare Express Backend URL string
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

class HotelBookingForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checkIn: null,
      checkOut: null,
      adult: "",
      children: "",
      suite: "none",
      rooms: "",
      paymentNumber: "",
      hotelName: props.hotelName || "",
      redirectToSubmission: false,
      error: "",
      success: false,
    };
  }

  handleChange = (field, value) => {
    this.setState({ [field]: value });
  };

  handleHotelClick = async (hotelName) => {
    try {
      await fetch(`${API_BASE_URL}/bookings/hotel-click`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ hotelName }),
      });
    } catch (error) {
      console.error(error);
    }
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const {
      checkIn,
      checkOut,
      adult,
      children,
      suite,
      rooms,
      paymentNumber,
      hotelName,
    } = this.state;

    const bookingData = {
      customer: localStorage.getItem("username") || null,
      email: localStorage.getItem("email") || null,
      checkIn,
      checkOut,
      adult,
      children,
      suite,
      rooms,
      paymentNumber,
      hotelName: hotelName || this.props.hotelName,
      amount: 0,
    };

    try {
      console.log("Submitting booking:", bookingData);
      
      // FIXED ENDPOINT PATH TO MATCH CLOUDFLARE EXPRESS ROUTER LAYER
      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });
      const resJson = await response.json().catch(() => null);

      if (response.ok && (resJson ? resJson.success : true)) {
        console.log("Booking successful", resJson);
        this.setState(
          {
            checkIn: null,
            checkOut: null,
            adult: "",
            children: "",
            suite: "none",
            rooms: "",
            paymentNumber: "",
            hotelName: this.props.hotelName || hotelName,
            error: "",
            success: true,
            redirectToSubmission: true,
          },
          () => {
            setTimeout(() => this.setState({ success: false }), 3500);
          },
        );
      } else {
        console.error("Booking failed", resJson || response.status);
        this.setState({
          error:
            resJson?.error ||
            "Booking failed. Please check the form and try again.",
          success: false,
        });
      }
    } catch (error) {
      console.error("Error connecting to the server:", error);
      this.setState({
        error: "Unable to connect to the booking server.",
        success: false,
      });
    }
  };

  renderGallery() {
    const { galleryImages = [] } = this.props;
    return (
      <div className="my-5 flex flex-wrap justify-start gap-4 md:my-10 md:gap-2">
        {galleryImages[0] && (
          <div className="w-[30%] min-w-24 sm:w-28">
            <img
              src={galleryImages[0]}
              alt=""
              className="h-20 w-full object-cover md:rounded-none"
            />
          </div>
        )}
        {galleryImages[1] && (
          <div className="w-[30%] min-w-24 sm:w-28">
            <img
              src={galleryImages[1]}
              alt=""
              className="h-20 w-full object-cover md:rounded-none"
            />
          </div>
        )}
        {galleryImages[2] && (
          <div className="w-[30%] min-w-24 sm:w-28">
            <img
              src={galleryImages[2]}
              alt=""
              className="h-20 w-full object-cover md:rounded-none"
            />
          </div>
        )}
        {galleryImages[3] && (
          <div className="w-[30%] min-w-24 sm:w-28">
            <img
              src={galleryImages[3]}
              alt=""
              className="h-20 w-full object-cover md:rounded-none"
            />
          </div>
        )}
      </div>
    );
  }

  render() {
    const { hotelName, location, heroImage } = this.props;
    if (this.state.redirectToSubmission) {
      return <Navigate to="/bookings/submission" replace />;
    }

    return (
      <>
        <NavBar />
        <div className="mx-3 mt-14 bg-white md:mt-20 lg:mx-44">
          <Link
            to="/bookings"
            className="text-left font-sans text-sm font-medium capitalize text-blue-700"
          >
            back
          </Link>
        </div>
        <div className="mt-5 flex h-auto flex-wrap justify-evenly bg-white">
          <div className="md:w-auto">
            <img src={heroImage} alt={hotelName} className="w-lg" />
            <div className="mx-3 md:mx-0 md:py-8">{this.renderGallery()}</div>
          </div>
          <div className="w-auto">
            <div className="flex h-auto flex-wrap items-start justify-center gap-6 px-4 md:justify-evenly md:px-6">
              <div className="w-full max-w-xl"></div>
              <div className="flex w-full max-w-xl justify-center">
                <div className="min-h-150 w-full max-w-sm bg-white md:shadow-sm">
                  <div className="mt-3 flex items-start justify-center gap-4 px-3">
                    <div className="shrink-0">
                      <img
                        src={heroImage}
                        alt={hotelName}
                        className="h-20 w-28 rounded-sm object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h1 className="text-left font-sans text-lg font-semibold capitalize">
                        {hotelName}
                      </h1>
                      <ul className="list-none py-3 text-sm leading-6">
                        <li>
                          <FontAwesomeIcon
                            icon={faLocationDot}
                            className="mr-2 text-black"
                          />
                          {location}
                        </li>
                        <li>
                          <FontAwesomeIcon
                            icon={faEnvelope}
                            className="mr-2 text-black"
                          />
                          :john@example.com
                        </li>
                        <li>
                          <FontAwesomeIcon
                            icon={faMobileScreenButton}
                            className="mr-2 text-black"
                          />
                          +231
                        </li>
                      </ul>
                    </div>
                  </div>

                  <form onSubmit={this.handleSubmit}>
                    <h3 className="mx-5 text-left text-sm font-semibold capitalize md:py-2">
                      availability
                    </h3>
                    <div className="flex flex-wrap justify-between gap-4 bg-white py-2">
                      <div className="ml-3 w-20">
                        <div className="mt-2 flex w-36 items-center gap-2 border-none border-stone-200 px-3">
                          <FontAwesomeIcon
                            icon={faCalendar}
                            className="text-sm text-black"
                          />
                          <DatePicker
                            selected={this.state.checkIn}
                            onChange={(d) => this.handleChange("checkIn", d)}
                            placeholderText="check in"
                            minDate={new Date()}
                            className="w-full border-none bg-gray-50 text-sm outline-none"
                          />
                        </div>
                      </div>

                      <div className="w-36">
                        <div className="mt-2 flex w-full items-center gap-2 border-none border-stone-200 px-3 py-2">
                          <FontAwesomeIcon
                            icon={faCalendar}
                            className="text-sm text-black"
                          />
                          <DatePicker
                            selected={this.state.checkOut}
                            onChange={(d) => this.handleChange("checkOut", d)}
                            placeholderText="check out"
                            minDate={this.state.checkIn || new Date()}
                            className="w-full border-none bg-gray-50 text-sm outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mx-3 flex flex-wrap justify-between gap-5 bg-white md:mx-5">
                      <div className="w-32">
                        <h3 className="font-sans text-sm font-semibold capitalize">
                          guest
                        </h3>
                        <br />
                        <p className="font-sans text-sm capitalize">adult</p>
                        <input
                          type="number"
                          value={this.state.adult}
                          onChange={(e) =>
                            this.handleChange("adult", e.target.value)
                          }
                          placeholder="0"
                          className="w-28 border-none bg-gray-50"
                        />
                      </div>

                      <div className="w-32">
                        <br />
                        <p className="font-sans text-sm capitalize">children</p>
                        <input
                          type="number"
                          value={this.state.children}
                          onChange={(e) =>
                            this.handleChange("children", e.target.value)
                          }
                          placeholder="0"
                          className="w-28 border-none bg-gray-50"
                        />
                      </div>
                    </div>

                    <br />

                    <div className="mx-3 flex flex-wrap justify-between gap-5 bg-white md:mx-5">
                      <div className="w-32">
                        <h3 className="font-sans text-sm font-semibold capitalize">
                          rooms &amp; suites
                        </h3>
                        <br />
                        <p className="font-sans text-sm capitalize">suites</p>
                        <select
                          value={this.state.suite}
                          onChange={(e) =>
                            this.handleChange("suite", e.target.value)
                          }
                          className="w-28 border-none bg-gray-50 text-sm capitalize"
                        >
                          <option value="none">None</option>
                          <option value="family">Family</option>
                          <option value="single">Single</option>
                          <option value="double">Double</option>
                        </select>
                      </div>

                      <div className="w-32">
                        <br />
                        <p className="font-sans text-sm capitalize">rooms</p>
                        <input
                          type="number"
                          value={this.state.rooms}
                          onChange={(e) =>
                            this.handleChange("rooms", e.target.value)
                          }
                          placeholder="0"
                          className="w-28 border-none bg-gray-50"
                        />
                      </div>
                    </div>

                    <div className="bg-white py-2">
                      <div className="bg-white py-3">
                        <input
                          type="tel"
                          value={this.state.paymentNumber}
                          onChange={(e) =>
                            this.handleChange("paymentNumber", e.target.value)
                          }
                          className="mx-3 w-50 bg-gray-50"
                          placeholder=" xxxxx"
                        />
                      </div>
                      <p className="mx-3 font-sans text-sm capitalize">
                        <span className="text-red-700">*</span>we accept payment
                        using orange money
                      </p>
                    </div>

                    <div className="mx-3 py-3 md:mx-3">
                      {this.state.error && (
                        <p className="mb-3 text-sm text-red-600">
                          {this.state.error}
                        </p>
                      )}
                      {this.state.success && (
                        <p className="mb-3 text-sm text-green-700">
                          Booking saved successfully.
                        </p>
                      )}
                      <button
                        type="submit"
                        className="cursor-pointer bg-amber-500 px-8 py-2 font-sans text-md font-medium capitalize"
                      >
                        book now
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Suites />
      </>
    );
  }
}

export default HotelBookingForm;