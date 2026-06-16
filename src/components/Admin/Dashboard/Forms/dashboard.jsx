import React from "react";
import AdminDashboardLayout from "../AdminDashboardLayout";

class DashBoard extends React.Component {
  render() {
    return (
      <AdminDashboardLayout title="dash board">
        {/* Cards */}
        <div className="flex flex-wrap md:mt-28 justify-evenly md:gap-10 gap-5">
          <div className="w-80 border border-gray-200 h-30 p-5">
            <h1 className="font-semibold text-lg">Total Reservations</h1>
            <span className="text-2xl">10</span>
          </div>

          <div className="w-80 border border-gray-200 h-30 p-5">
            <h1 className="font-semibold text-lg">Total Guests</h1>
            <span className="text-2xl">20</span>
          </div>

          <div className="w-80 border border-gray-200 h-30 p-5">
            <h1 className="font-semibold text-lg">Total Rooms</h1>
            <span className="text-2xl">5</span>
          </div>
        </div>

        {/* Analysis Header */}
        <div id="header" className="md:my-10">
          <h1 className="font-semibold text-xl capitalize md:mx-8">analysis</h1>
        </div>

        {/* Analysis Section */}
        <div className="h-auto bg-white flex flex-wrap justify-center items-center">
          {/* Graph */}
          <div className="md:w-lg border-none h-80">
            <div className="bg-white w-full max-w-3xl">
              <div className="flex items-center justify-between mb-8">
                <span className="font-semibold md:p-4 text-md md:mt-5 capitalize">
                  reservations
                </span>

                <button className="border border-gray-200 px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                  This Week
                </button>
              </div>

              {/* Chart */}
              <div className="relative h-72 md:mx-12">
                {/* Grid */}
                <div className="absolute inset-0 flex flex-col justify-between">
                  {[100, 75, 50, 25, 0].map((item, index) => (
                    <div
                      key={index}
                      className="relative border-t border-gray-200"
                    >
                      <span className="absolute -left-10 -top-3 text-sm">
                        {item}%
                      </span>
                    </div>
                  ))}
                </div>

                {/* SVG */}
                <svg
                  viewBox="0 0 700 260"
                  className="absolute inset-0 w-full h-full"
                  preserveAspectRatio="none"
                >
                  <path
                    d="
                        M20 145
                        C60 140, 90 95, 120 80
                        S190 105, 220 115
                        S300 110, 330 112
                        S410 130, 440 120
                        S520 70, 550 60
                        S620 95, 680 110
                      "
                    fill="none"
                    stroke="gray"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />

                  {[
                    [20, 145],
                    [120, 80],
                    [220, 115],
                    [330, 112],
                    [440, 120],
                    [550, 60],
                    [680, 110],
                  ].map(([x, y], index) => (
                    <circle key={index} cx={x} cy={y} r="7" fill="black" />
                  ))}
                </svg>

                {/* Labels */}
                <div className="absolute -bottom-8 left-0 right-0 flex justify-between text-sm px-2">
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                  <span>Sun</span>
                </div>
              </div>
            </div>
          </div>

          {/* Availability */}
          <div className="w-xl bg-white border-none border-gray-200 p-5">
            <h1 className="text-xl capitalize font-semibold text-gray-900 mb-10 md:mx-5">
              availability
            </h1>

            <div className="flex items-center justify-center gap-10">
              {/* Circle */}
              <div className="relative flex h-56 w-56 items-center justify-center rounded-full bg-[conic-gradient(theme(colors.blue.500)_0%_40%,theme(colors.blue.900)_40%_87%,theme(colors.blue.400)_87%_97%,theme(colors.blue.300)_97%_100%)] shadow-sm">
                {/* Inner Circle */}
                <div className="flex h-44 w-44 flex-col items-center justify-center rounded-full bg-white">
                  <h1 className="text-5xl font-semibold text-gray-900">60</h1>
                  <p className="mt-2 text-lg text-gray-500">Total Rooms</p>
                </div>
              </div>

              {/* Legends */}
              <div className="space-y-8">
                <div className="flex items-center justify-between gap-10">
                  <div className="flex items-center gap-4">
                    <div className="h-4 w-4 rounded-full bg-blue-500"></div>
                    <span className="text-xl text-gray-700">Available</span>
                  </div>
                  <span className="text-xl text-gray-600">24 (40%)</span>
                </div>

                <div className="flex items-center justify-between gap-10">
                  <div className="flex items-center gap-4">
                    <div className="h-4 w-4 rounded-full bg-blue-900"></div>
                    <span className="text-lg text-gray-700">Approve</span>
                  </div>
                  <span className="text-lg text-gray-600">28 (47%)</span>
                </div>

                <div className="flex items-center justify-between gap-10">
                  <div className="flex items-center gap-4">
                    <div className="h-4 w-4 rounded-full bg-blue-400"></div>
                    <span className="text-xl text-gray-700">Decline</span>
                  </div>
                  <span className="text-xl text-gray-600">6 (10%)</span>
                </div>

                <div className="flex items-center justify-between gap-10">
                  <div className="flex items-center gap-4">
                    <div className="h-4 w-4 rounded-full bg-blue-300"></div>
                    <span className="text-xl text-gray-700">Pending</span>
                  </div>
                  <span className="text-xl text-gray-600">2 (3%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AdminDashboardLayout>
    );
  }
}

export default DashBoard;
