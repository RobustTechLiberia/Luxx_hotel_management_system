import React from "react";
import { NavLink } from "react-router-dom";

/**
 * Shared admin dashboard layout with sidebar + top navbar.
 * Wrap every /admin/dashboard/* page with this to keep navigation consistent.
 */
class AdminDashboardLayout extends React.Component {
  render() {
    const { children, title = "dash board" } = this.props;

    return (
      <>
        {/* Sidebar */}
        <button
          data-drawer-target="sidebar-multi-level-sidebar"
          data-drawer-toggle="sidebar-multi-level-sidebar"
          aria-controls="sidebar-multi-level-sidebar"
          type="button"
          className="text-black bg-white border border-transparent hover:bg-white focus:ring-4 focus:ring-gray-300 font-medium leading-5 ms-3 mt-3 text-sm p-2 focus:outline-none inline-flex sm:hidden"
        >
          <span className="sr-only">Open sidebar</span>

          <svg
            className="w-6 h-6"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="2"
              d="M5 7h14M5 12h14M5 17h10"
            />
          </svg>
        </button>

        <aside
          id="sidebar-multi-level-sidebar"
          className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
          aria-label="Sidebar"
        >
          <div className="h-full px-3 py-4 overflow-y-auto bg-blue-950 border-r border-gray-700">
            <ul className="space-y-2 font-medium">
              <li>
                <NavLink
                  to="/admin/dashboard"
                  end
                  className={({ isActive }) =>
                    `flex items-center px-2 py-2 text-white group ${
                      isActive ? "bg-blue-800" : ""
                    }`
                  }
                >
                  <span className="ms-3">Home</span>
                </NavLink>
              </li>

              <li>
                <button
                  type="button"
                  className="flex items-center w-full justify-between px-2 py-2 text-white hover:bg-blue-800 group"
                >
                  <span className="flex-1 ms-3 text-left whitespace-nowrap">
                    Reservations
                  </span>

                  <svg
                    className="w-5 h-5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m19 9-7 7-7-7"
                    />
                  </svg>
                </button>

                <ul className="py-2 space-y-2">
                  <li>
                    <NavLink
                      to="/admin/dashboard/add-hotel"
                      className={({ isActive }) =>
                        `pl-10 flex items-center px-2 py-2 text-white ${
                          isActive ? "bg-blue-800" : "hover:bg-blue-800"
                        }`
                      }
                    >
                      Add Hotels
                    </NavLink>
                  </li>

                  <li>
                    <NavLink
                      to="/admin/dashboard/booking-summary"
                      className={({ isActive }) =>
                        `pl-10 flex items-center px-2 py-2 text-white ${
                          isActive ? "bg-blue-800" : "hover:bg-blue-800"
                        }`
                      }
                    >
                      Booking Summary
                    </NavLink>
                  </li>
                </ul>
              </li>

              <li>
                <NavLink
                  to="/admin/dashboard/billing"
                  className={({ isActive }) =>
                    `flex items-center px-2 py-2 text-white ${
                      isActive ? "bg-blue-800" : "hover:bg-blue-800"
                    }`
                  }
                >
                  <span className="flex-1 ms-3 whitespace-nowrap">Billing</span>
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/admin/dashboard/invoice"
                  className={({ isActive }) =>
                    `flex items-center px-2 py-2 text-white ${
                      isActive ? "bg-blue-800" : "hover:bg-blue-800"
                    }`
                  }
                >
                  <span className="flex-1 ms-3 whitespace-nowrap">Invoice</span>
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/admin/dashboard/settings"
                  className={({ isActive }) =>
                    `flex items-center px-2 py-2 text-white ${
                      isActive ? "bg-blue-800" : "hover:bg-blue-800"
                    }`
                  }
                >
                  <span className="flex-1 ms-3 whitespace-nowrap">
                    Settings
                  </span>
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/admin/dashboard/logout"
                  className={({ isActive }) =>
                    `flex items-center px-2 py-2 text-white ${
                      isActive ? "bg-blue-800" : "hover:bg-blue-800"
                    }`
                  }
                >
                  <span className="flex-1 ms-3 whitespace-nowrap">Log out</span>
                </NavLink>
              </li>
            </ul>
          </div>
        </aside>

        {/* Main Container */}
        <div className="sm:ml-64">
          <div className="p-2 rounded-none">
            <nav className="bg-white border-b fixed w-full top-0 z-50 border-none">
              <div className="max-w-screen-xl flex flex-wrap items-center justify-between p-2">
                <span className="self-center text-2xl md:text-xl text-black md:mx-2 m-4 capitalize font-semibold whitespace-nowrap">
                  {title}
                </span>
              </div>
            </nav>

            {children}
          </div>
        </div>
      </>
    );
  }
}

export default AdminDashboardLayout;
