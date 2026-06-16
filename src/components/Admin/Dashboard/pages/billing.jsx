import React from "react";
import AdminDashboardLayout from "../AdminDashboardLayout";

class Billing extends React.Component {
  render() {
    return (
      <AdminDashboardLayout title="Billing">
        <div className="p-6 md:mt-20">
          <h1 className="text-2xl font-semibold mb-4">Billing</h1>
          <p className="text-sm text-gray-600">
            Billing management placeholder.
          </p>
        </div>
      </AdminDashboardLayout>
    );
  }
}

export default Billing;
