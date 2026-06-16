import React from "react";
import { Link } from "react-router-dom";

class NavBar extends React.Component {
  render() {
    return (
      <>
        <nav class="bg-white md:bg-white fixed w-full z-20 top-0 inset-s-0 border-b-none  border-b-neutral-secondary-medium border-default">
          <div class="max-w-7xl  flex flex-wrap items-center justify-between mx-auto p-3">
            <Link
              to="/"
              class="flex items-center space-x-3 rtl:space-x-reverse"
            >
              {/* <img
                src="https://flowbite.com/docs/images/logo.svg"
                class="h-7"
                alt="Flowbite Logo"
              /> */}
              <span class="self-center text-xl font-outfit md:mx-20 mx-2 whitespace-nowrap uppercase m">
                luxx
              </span>
            </Link>
            {/* login button */}
            <div class="inline-flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
              <Link
                to="/login"
                class="text-white rounded-sm bg-blue-700 cursor-pointer md:mx-20 hover:bg-brand-strong box-border border border-transparent focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5  text-sm px-8 py-2 focus:outline-none capitalize"
              >
                login
              </Link>
              <button
                data-collapse-toggle="navbar-cta"
                type="button"
                class="inline-flex items-center p-2 w-9 h-9 justify-center text-sm text-body bg-white md:bg-white border-0 rounded-base md:hidden hover:bg-white hover:text-heading focus:outline-none focus:ring-0 focus:ring-transparent"
                aria-controls="navbar-cta"
                aria-expanded="false"
              >
                <span class="sr-only">Open main menu</span>
                <svg
                  class="w-6 h-6"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-width="2"
                    d="M5 7h14M5 12h14M5 17h14"
                  />
                </svg>
              </button>
            </div>
            <div
              class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
              id="navbar-cta"
            >
              <ul class="font-medium flex flex-col p-4 md:p-0 mt-4 border-none border-default rounded-none bg-white md:bg-white md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0">
                <li>
                  <Link
                    to="/"
                    class="block py-2 px-3 text-heading bg-transparent border-0 rounded-none md:text-black md:p-0 md:bg-transparent"
                    aria-current="page"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <a
                    href="#"
                    class="block py-2 px-3 text-heading bg-transparent border-0 rounded-none hover:bg-transparent md:hover:bg-transparent md:hover:text-fg-brand md:p-0"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    class="block py-2 px-3 text-heading bg-transparent border-0 rounded-none hover:bg-transparent md:hover:bg-transparent md:hover:text-fg-brand md:p-0"
                  >
                    Services
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    class="block py-2 px-3 text-heading bg-transparent border-0 rounded-none hover:bg-transparent md:hover:bg-transparent md:hover:text-fg-brand md:p-0"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </>
    );
  }
}

export default NavBar;
