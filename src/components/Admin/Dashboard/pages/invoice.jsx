import React from "react";
import AdminDashboardLayout from "../AdminDashboardLayout";

class Invoice extends React.Component {
  render() {
    return (
      <AdminDashboardLayout title="Invoice">
        <div className="p-6 md:mt-20">
          <h1 className="text-2xl font-semibold mb-4">Invoice</h1>
          <p className="text-sm text-gray-600">
            Invoice generation placeholder.
          </p>
        </div>
      </AdminDashboardLayout>
    );
  }
}

export default Invoice;
