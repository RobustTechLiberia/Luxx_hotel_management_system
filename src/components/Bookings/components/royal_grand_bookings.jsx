import React from "react";
import HotelBookingForm from "./hotel_booking_form";
import img1 from "../../../assets/images/Z (6).jpeg";
import img2 from "../../../assets/images/Z (18).jpeg";
import img3 from "../../../assets/images/9k= (18).jpeg";
import img4 from "../../../assets/images/Z (16).jpeg";

class RoyalGrandBooking extends React.Component {
  render() {
    return (
      <HotelBookingForm
        hotelName="royal grand hotel"
        location="15 street"
        heroImage={img1}
        galleryImages={[img2, img3, img4]}
      />
    );
  }
}

export default RoyalGrandBooking;
