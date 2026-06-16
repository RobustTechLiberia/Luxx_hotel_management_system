import React from "react";
import AdminDashboardLayout from "../AdminDashboardLayout";

class BookingSummary extends React.Component {
  render() {
    return (
      <AdminDashboardLayout title="Booking Summary">
        <div className="p-6 md:mt-20">
          <h1 className="text-2xl font-semibold mb-4">Booking Summary</h1>
          <p className="text-sm text-gray-600">
            This page will display a list of reservations and summary details.
            Implement fetching of bookings from the server and replace this
            placeholder with a table or cards.
          </p>
        </div>
      </AdminDashboardLayout>
    );
  }
}

export default BookingSummary;
