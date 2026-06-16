import React from "react";
import AdminDashboardLayout from "../AdminDashboardLayout";

class Settings extends React.Component {
  render() {
    return (
      <AdminDashboardLayout title="Settings">
        <div className="p-6 md:mt-20">
          <h1 className="text-2xl font-semibold mb-4">Settings</h1>
          <p className="text-sm text-gray-600">Admin settings placeholder.</p>
        </div>
      </AdminDashboardLayout>
    );
  }
}

export default Settings;
