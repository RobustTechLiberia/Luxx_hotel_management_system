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

// Your Cloudflare Worker Express production domain
const API_BASE_URL = "https://luxx.gabrielwkun.workers.dev";

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
      isLoading: false, // Prevents multiple rapid button clicks
    };
  }

  handleChange = (field, value) => {
    this.setState({ [field]: value });
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

    // 1. Basic Client-Side Validation Checks
    if (!checkIn || !checkOut) {
      this.setState({ error: "Please select both check-in and check-out dates.", success: false });
      return;
    }

    if (!rooms || parseInt(rooms, 10) <= 0) {
      this.setState({ error: "Please specify at least 1 room to book.", success: false });
      return;
    }

    if (!paymentNumber.trim()) {
      this.setState({ error: "Please enter your Orange Money phone number.", success: false });
      return;
    }

    this.setState({ isLoading: true, error: "" });

    // 2. Auth State Check
    // NOTE: Your backend strictly requires user validation. Replace these hardcoded stubs 
    // with actual data from local storage, cookies, or your Global Auth Context!
    const currentCustomerName = "John Doe"; 
    const currentCustomerEmail = "john.doe@example.com";

    // 3. Network Fetch Attempt
    try {
      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          customer: currentCustomerName,
          email: currentCustomerEmail,
          hotelName: this.props.hotelName || hotelName,
          checkIn: checkIn,
          checkOut: checkOut,
          rooms: parseInt(rooms, 10),
          suite: suite === "none" ? "" : suite, // backend matches your suite list strings
          adult: parseInt(adult, 10) || 0,
          children: parseInt(children, 10) || 0,
          paymentNumber: paymentNumber.trim()
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Fallback to error field returned from your backend router definitions
        throw new Error(data.error || "Something went wrong on the server.");
      }

      // 4. Success handling matching your native state resetting strategy
      this.setState(
        {
          checkIn: null,
          checkOut: null,
          adult: "",
          children: "",
          suite: "none",
          rooms: "",
          paymentNumber: "",
          error: "",
          success: true,
          isLoading: false,
        },
        () => {
          // Keep success banner visible briefly, then trigger router navigation
          setTimeout(() => {
            this.setState({ redirectToSubmission: true });
          }, 2000);
        }
      );

    } catch (err) {
      this.setState({
        error: err.message || "Could not reach the booking server.",
        success: false,
        isLoading: false,
      });
    }
  };

  renderGallery() {
    const { galleryImages = [] } = this.props;
    return (
      <div className="my-5 flex flex-wrap justify-start gap-4 md:my-10 md:gap-2">
        {galleryImages.slice(0, 4).map((src, index) => (
          <div key={index} className="w-[30%] min-w-24 sm:w-28">
            <img
              src={src}
              alt=""
              className="h-20 w-full object-cover md:rounded-none"
            />
          </div>
        ))}
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
                          <FontAwesomeIcon icon={faLocationDot} className="mr-2 text-black" />
                          {location}
                        </li>
                        <li>
                          <FontAwesomeIcon icon={faEnvelope} className="mr-2 text-black" />
                          :john@example.com
                        </li>
                        <li>
                          <FontAwesomeIcon icon={faMobileScreenButton} className="mr-2 text-black" />
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
                          <FontAwesomeIcon icon={faCalendar} className="text-sm text-black" />
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
                          <FontAwesomeIcon icon={faCalendar} className="text-sm text-black" />
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
                        <h3 className="font-sans text-sm font-semibold capitalize">guest</h3>
                        <br />
                        <p className="font-sans text-sm capitalize">adult</p>
                        <input
                          type="number"
                          value={this.state.adult}
                          onChange={(e) => this.handleChange("adult", e.target.value)}
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
                          onChange={(e) => this.handleChange("children", e.target.value)}
                          placeholder="0"
                          className="w-28 border-none bg-gray-50"
                        />
                      </div>
                    </div>

                    <br />

                    <div className="mx-3 flex flex-wrap justify-between gap-5 bg-white md:mx-5">
                      <div className="w-32">
                        <h3 className="font-sans text-sm font-semibold capitalize">rooms &amp; suites</h3>
                        <br />
                        <p className="font-sans text-sm capitalize">suites</p>
                        <select
                          value={this.state.suite}
                          onChange={(e) => this.handleChange("suite", e.target.value)}
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
                          onChange={(e) => this.handleChange("rooms", e.target.value)}
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
                          onChange={(e) => this.handleChange("paymentNumber", e.target.value)}
                          className="mx-3 w-50 bg-gray-50"
                          placeholder=" xxxxx"
                        />
                      </div>
                      <p className="mx-3 font-sans text-sm capitalize">
                        <span className="text-red-700">*</span>we accept payment using orange money
                      </p>
                    </div>

                    <div className="mx-3 py-3 md:mx-3">
                      {this.state.error && (
                        <p className="mb-3 text-sm text-red-600">{this.state.error}</p>
                      )}
                      {this.state.success && (
                        <p className="mb-3 text-sm text-green-700">Booking processing! Please check your device...</p>
                      )}
                      <button
                        type="submit"
                        disabled={this.state.isLoading}
                        className={`cursor-pointer px-8 py-2 font-sans text-md font-medium capitalize ${
                          this.state.isLoading ? "bg-gray-400 opacity-50 cursor-not-allowed" : "bg-amber-500"
                        }`}
                      >
                        {this.state.isLoading ? "Submitting..." : "book now"}
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