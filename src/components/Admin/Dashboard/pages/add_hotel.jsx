import React from "react";
import AdminDashboardLayout from "../AdminDashboardLayout";

class AddHotel extends React.Component {
  render() {
    return (
      <AdminDashboardLayout title="add hotel">
        <div className="">
          <h1 className="capitalize text-3xl font-semibold">Add Hotel</h1>
        </div>

        <div className="bg-white md:mt-20 p-5">
          <form className="md:mx-5 flex flex-wrap justify-start gap-5">
            {/* Hotel Name */}
            <input
              type="text"
              placeholder="Hotel Name"
              className="md:w-lg py-2 px-2 border"
            />

            {/* Location */}
            <input
              type="text"
              placeholder="Location"
              className="md:w-lg border py-2 px-2"
            />

            {/* Price + Description + Submit */}
            <div className="flex flex-col">
              <input
                type="text"
                placeholder="$0.00"
                className="border py-2 px-2"
              />

              <textarea
                name="description"
                placeholder="Description"
                className="border mt-4 p-2 w-xl min-h-[200px]"
              />

              <button
                type="submit"
                className="mt-4 bg-blue-950 text-white py-2  w-28 rounded hover:bg-blue-600 transition"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </AdminDashboardLayout>
    );
  }
}

export default AddHotel;
