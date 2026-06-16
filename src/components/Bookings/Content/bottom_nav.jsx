import React from "react";

class BottomNav extends React.Component {
  render() {
    return (
      <>
        <div className="md:my-16 bg-white md:mx-20">
          <ul className="list-none inline">
            <li>
              <a
                href="#"
                className="text-sm text-blue-900 font-sans capitalize"
              >
                back
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-2xl font-sans font-semibold capitalize"
              >
                dash board
              </a>
            </li>
          </ul>
        </div>
      </>
    );
  }
}

export default BottomNav;
