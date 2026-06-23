import React from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import NavBar from "../../Content/nav";
import BookingChatbot from "./booking_chatbot";

class FormSubmission extends React.Component {
  render() {
    return (
      <>
        <NavBar />
        <div className="flex flex-wrap justify-center items-center md:mt-28 bg-white mt-24 h-auto">
          {/* <h1 className="flex items-center text-3xl font-sans capitalize font-semibold text-center">
            <FontAwesomeIcon icon={faCircleCheck} className="text-green-600" />
            sucessfull
          </h1> */}
        </div>
        <div className="flex flex-wrap justify-center items-center md:mt-10 mt-8 bg-white h-auto">
          <p className="md:text-xl md:text-left text-left mx-5 md:w-lg w-auto font-sans capitalize font-normal">
            dear value customer,
            <br />
            <br />
            kindly check your email address for the booking details and
            confirmation. We look forward to welcoming you to our hotel and
            providing you with an exceptional stay. If you have any questions or
            need further assistance, please don't hesitate to contact us.
            <br />
            <br />
            thanks
          </p>
        </div>
        <BookingChatbot />
      </>
    );
  }
}

export default FormSubmission;
