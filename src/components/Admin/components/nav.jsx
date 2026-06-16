import React from "react";

class Nav extends React.Component {
  render() {
    return (
      <>
        <header className="fixed top-0 inset-x-0 z-20 w-full">
          <nav className="bg-neutral-primary">
            <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between p-4">
              <a
                href="https://flowbite.com"
                className="flex items-center space-x-3 rtl:space-x-reverse"
              >
                {/* <img
                  src="https://flowbite.com/docs/images/logo.svg"
                  className="h-7"
                  alt="Flowbite Logo"
                /> */}
                <span className="self-center whitespace-nowrap uppercase text-xl fontnormal">
                  luxx
                </span>
              </a>
              {/* <div className="flex items-center space-x-6 rtl:space-x-reverse">
                <a
                  href="tel:5541251234"
                  className="text-sm text-body hover:underline"
                >
                  (555) 412-1234
                </a>
                <a
                  href="#"
                  className="text-sm font-medium text-fg-brand hover:underline"
                >
                  Login
                </a>
              </div> */}
            </div>
          </nav>
          {/* <nav className="border-y border-default bg-neutral-secondary-soft">
            <div className="mx-auto max-w-7xl px-4 py-3">
              <div className="flex items-center">
                <ul className="mt-0 flex flex-row space-x-8 text-sm font-medium rtl:space-x-reverse">
                  <li>
                    <a
                      href="#"
                      className="text-heading hover:underline"
                      aria-current="page"
                    >
                      Home
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-heading hover:underline">
                      Company
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-heading hover:underline">
                      Team
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-heading hover:underline">
                      Features
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </nav> */}
        </header>
      </>
    );
  }
}

export default Nav;
