import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faSearch } from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

class Filtering extends React.Component {
  state = {
    checkIn: null,
    checkOut: null,
  };

  render() {
    return (
      <>
        {/* filter booking wrapper */}
        <div className="md:mt-36 mt-8 mx-8 mb-8 flex flex-wrap md:justify-center items-end gap-6">
          
          {/* check in */}
          <div className="w-full md:w-auto">
            <p className="font-sans text-lg capitalize mb-2">check in</p>
            <div className="flex w-full items-center gap-2 border-0 border-slate-400 p-2 rounded">
              <FontAwesomeIcon icon={faCalendar} className="text-xl" />
              <DatePicker
                selected={this.state.checkIn}
                onChange={(date) => this.setState({ checkIn: date })}
                placeholderText="select date"
                className="w-full outline-none"
              />
            </div>
          </div>

          {/* check out */}
          <div className="w-full md:w-auto">
            <p className="font-sans text-lg capitalize mb-2">check out</p>
            <div className="flex w-full items-center gap-2 border-0 border-slate-400 p-2 rounded">
              <FontAwesomeIcon icon={faCalendar} className="text-xl" />
              <DatePicker
                selected={this.state.checkOut}
                onChange={(date) => this.setState({ checkOut: date })}
                placeholderText="Select date"
                className="w-full outline-none"
              />
            </div>
          </div>

          {/* destination */}
          <div className="w-full md:w-auto">
            <p className="font-sans text-lg capitalize mb-2">location</p>
            <div className="flex w-full items-center border-0 border-slate-400 p-2 rounded">
              <input 
                type="text" 
                placeholder="search.." 
                className="w-full md:w-auto outline-none" 
              />
            </div>
          </div>

          {/* search button container matching the footprint of others */}
          <div className="w-full md:w-auto">
            {/* Invisible placeholder matching the height of the labels above */}
            <p className="text-lg mb-2 select-none opacity-0 pointer-events-none">Search</p>
            <button
              type="submit"
              className="bg-amber-500 text-md font-sans py-4.5  cursor-pointer w-full md:w-12 flex items-center justify-center rounded-none"
            >
              <FontAwesomeIcon icon={faSearch} className="text-lg" />
            </button>
          </div>

        </div>
      </>
    );
  }
}

export default Filtering;