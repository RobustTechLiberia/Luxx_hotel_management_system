import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import PageLoader from "./components/page_loader";
import HomePage from "./pages/home";
import RoyalGrandHotel from "./pages/royal_grand_hotel";
import CoronaHotel from "./pages/corona_hotel";
import BoluvardPalaceHotel from "./pages/boluvard_palace";
import BellaCasaHotel from "./pages/bella_casa_hotel";
import SinkorPalaceHotel from "./pages/sinkor_palace";
import FammingtonHotel from "./pages/fammington_hotel";
import RoyalGrandBooking from "./components/Bookings/components/royal_grand_bookings";
import CoronaHotelBooking from "./components/Bookings/components/coronal_hotel_bookings";
import BoluvardHotelBooking from "./components/Bookings/components/boluvard_hotel_bookings";
import BellaCassaHotelBooking from "./components/Bookings/components/bella_casa_hotel_bookings";
import SinkorPalaceHotelBooking from "./components/Bookings/components/sinkor_palace_bookings";
import FammingtonHotelBooking from "./components/Bookings/components/fammington_hotel_bookings";
import FormSubmission from "./components/Bookings/components/submission";
import LoginForm from "./components/Auth/Login/login";
import AuthCode from "./components/Auth/Login/2_factors_auth";
import ForgotPassword from "./components/Auth/Login/forget_password";
import SignupForm from "./components/Auth/Login/Signup/signup";
import BookingHomePage from "./components/Bookings/pages/home";
import BookingRoyalGrandHotel from "./components/Bookings/pages/royal_grand_hotel";
import BookingCoronaHotel from "./components/Bookings/pages/corona_hotel";
import BookingBoluvardPalaceHotel from "./components/Bookings/pages/boluvard_palace";
import BookingBellaCasaHotel from "./components/Bookings/pages/bella_casa_hotel";
import BookingSinkorPalaceHotel from "./components/Bookings/pages/sinkor_palace";
import BookingFammingtonHotel from "./components/Bookings/pages/fammington_hotel";
import axios from "axios";
import AdminDefault from "./components/Admin/components/default";
import AdminDashboard from "./components/Admin/Dashboard/Forms/dashboard";
import AddHotel from "./components/Admin/Dashboard/pages/add_hotel";
import BookingSummary from "./components/Admin/Dashboard/pages/booking_summary";
import Billing from "./components/Admin/Dashboard/pages/billing";
import Invoice from "./components/Admin/Dashboard/pages/invoice";
import Settings from "./components/Admin/Dashboard/pages/settings";
import Logout from "./components/Admin/Dashboard/pages/logout";

class App extends React.Component {
  state = {
    isLoading: true,
  };

  componentDidMount() {
    this.loaderTimeout = window.setTimeout(() => {
      this.setState({ isLoading: false });
    }, 5000);

    // Test connection to the backend
    axios
      .get("http://localhost:8080/home")
      .then(() => {
        console.log("Connected to the backend successfully.");
      })
      .catch((error) => {
        console.error("Error connecting to the backend:", error);
      });
  }

  componentWillUnmount() {
    window.clearTimeout(this.loaderTimeout);
  }

  render() {
    if (this.state.isLoading) {
      return <PageLoader />;
    }

    return (
      <div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/royal-grand-hotel" element={<RoyalGrandHotel />} />
          <Route path="/corona-hotel" element={<CoronaHotel />} />
          <Route path="/boluvard-palace" element={<BoluvardPalaceHotel />} />
          <Route path="/bella-casa-hotel" element={<BellaCasaHotel />} />
          <Route path="/sinkor-palace-hotel" element={<SinkorPalaceHotel />} />
          <Route path="/fammington-hotel" element={<FammingtonHotel />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/two-factor-auth" element={<AuthCode />} />
          <Route path="/forget-password" element={<ForgotPassword />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/admin" element={<AdminDefault />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/dashboard/add-hotel" element={<AddHotel />} />
          <Route
            path="/admin/dashboard/booking-summary"
            element={<BookingSummary />}
          />
          <Route path="/admin/dashboard/billing" element={<Billing />} />
          <Route path="/admin/dashboard/invoice" element={<Invoice />} />
          <Route path="/admin/dashboard/settings" element={<Settings />} />
          <Route path="/admin/dashboard/logout" element={<Logout />} />
          <Route path="/bookings" element={<BookingHomePage />} />
          <Route
            path="/bookings/hotels/royal-grand-hotel"
            element={<BookingRoyalGrandHotel />}
          />
          <Route
            path="/bookings/hotels/corona-hotel"
            element={<BookingCoronaHotel />}
          />
          <Route
            path="/bookings/hotels/boluvard-palace"
            element={<BookingBoluvardPalaceHotel />}
          />
          <Route
            path="/bookings/hotels/bella-casa-hotel"
            element={<BookingBellaCasaHotel />}
          />
          <Route
            path="/bookings/hotels/sinkor-palace-hotel"
            element={<BookingSinkorPalaceHotel />}
          />
          <Route
            path="/bookings/hotels/fammington-hotel"
            element={<BookingFammingtonHotel />}
          />
          <Route
            path="/bookings/royal-grand-hotel"
            element={<RoyalGrandBooking />}
          />
          <Route
            path="/bookings/corona-hotel"
            element={<CoronaHotelBooking />}
          />
          <Route
            path="/bookings/boluvard-palace"
            element={<BoluvardHotelBooking />}
          />
          <Route
            path="/bookings/bella-casa-hotel"
            element={<BellaCassaHotelBooking />}
          />
          <Route
            path="/bookings/sinkor-palace-hotel"
            element={<SinkorPalaceHotelBooking />}
          />
          <Route
            path="/bookings/fammington-hotel"
            element={<FammingtonHotelBooking />}
          />
          <Route path="/bookings/submission" element={<FormSubmission />} />
        </Routes>
      </div>
    );
  }
}

export default App;
