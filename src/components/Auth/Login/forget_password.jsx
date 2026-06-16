import React from "react";
import { Link, Navigate } from "react-router-dom";
import NavBar from "../../Content/nav";

class ForgotPassword extends React.Component {
  state = {
    redirectToTwoFactor: false,
    errors: {},
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email")?.toString().trim() || "";
    const errors = {};

    if (!email) {
      errors.email = "Email address is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Enter a valid email address.";
    }

    if (Object.keys(errors).length > 0) {
      this.setState({ errors });
      return;
    }

    this.setState({ errors: {}, redirectToTwoFactor: true });
  };

  getInputClass = (fieldName) =>
    `w-full border-b border-l-0 border-r-0 border-t-0 px-0 py-3 text-left text-base outline-none ${
      this.state.errors[fieldName]
        ? "border-red-500 text-red-900 placeholder-red-400"
        : "border-gray-300"
    }`;

  render() {
    if (this.state.redirectToTwoFactor) {
      return <Navigate to="/two-factor-auth" replace />;
    }

    return (
      <>
        <NavBar />
        <div className="mt-16 min-h-screen bg-white px-4 py-10 sm:px-6 md:mt-3 md:flex md:items-center md:justify-center md:px-8">
          <div className="flex w-full justify-center">
            <form
              onSubmit={this.handleSubmit}
              className="w-full max-w-md bg-white px-5 py-10 sm:px-8 md:rounded-none md:border md:border-gray-200 md:px-10 md:shadow-sm"
            >
              <legend>
                <h3 className="py-2 text-left font-sans text-2xl font-medium capitalize sm:text-3xl">
                  forget password
                </h3>
              </legend>
              <div className="mt-6 space-y-6">
                <input
                  type="email"
                  name="email"
                  className={this.getInputClass("email")}
                  placeholder="email address"
                  required
                />
                {this.state.errors.email && (
                  <p className="text-sm text-red-500">{this.state.errors.email}</p>
                )}
                <p className="text-left font-sans text-md font-normal">
                  Remember your password?
                  <Link to="/login" className="mx-2 text-blue-700">
                    login
                  </Link>
                </p>
                <button
                  type="submit"
                  className="w-full cursor-pointer rounded-none border-none bg-blue-700 px-6 py-3 text-base font-medium capitalize text-white sm:w-auto"
                >
                  continue
                </button>
              </div>
            </form>
          </div>
        </div>
      </>
    );
  }
}

export default ForgotPassword;
