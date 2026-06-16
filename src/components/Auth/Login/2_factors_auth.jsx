import React from "react";
import { Link } from "react-router-dom";
import NavBar from "../../Content/nav";

class AuthCode extends React.Component {
  state = {
    errors: {},
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const d1 = formData.get("digit1")?.toString().trim() || "";
    const d2 = formData.get("digit2")?.toString().trim() || "";
    const d3 = formData.get("digit3")?.toString().trim() || "";
    const d4 = formData.get("digit4")?.toString().trim() || "";
    const code = d1 + d2 + d3 + d4;

    // No validation as requested; clear errors and continue
    this.setState({ errors: {} });
  };

  getInputClass = () =>
    `h-14 w-14 border text-center text-xl outline-none sm:h-16 sm:w-16 ${
      this.state.errors.code ? "border-red-500 text-red-900" : "border-gray-300"
    }`;

  render() {
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
                  two factor authentication
                </h3>
              </legend>
              <p className="mt-3 text-left font-sans text-sm text-gray-600">
                Enter the 4-digit verification code sent to your email.
              </p>
              <div className="mt-8 flex items-center justify-between gap-3 sm:gap-4">
                <input
                  type="text"
                  name="digit1"
                  inputMode="numeric"
                  maxLength="1"
                  pattern="[0-9]"
                  className={this.getInputClass()}
                  required
                />
                <input
                  type="text"
                  name="digit2"
                  inputMode="numeric"
                  maxLength="1"
                  pattern="[0-9]"
                  className={this.getInputClass()}
                  required
                />
                <input
                  type="text"
                  name="digit3"
                  inputMode="numeric"
                  maxLength="1"
                  pattern="[0-9]"
                  className={this.getInputClass()}
                  required
                />
                <input
                  type="text"
                  name="digit4"
                  inputMode="numeric"
                  maxLength="1"
                  pattern="[0-9]"
                  className={this.getInputClass()}
                  required
                />
              </div>
              {this.state.errors.code && (
                <p className="mt-3 text-sm text-red-500">
                  {this.state.errors.code}
                </p>
              )}
              <div className="mt-8 space-y-4">
                <button
                  type="submit"
                  className="w-full cursor-pointer rounded-none border-none bg-blue-700 px-6 py-3 text-base font-medium capitalize text-white sm:w-auto"
                >
                  verify code
                </button>
                <p className="text-left font-sans text-md font-normal">
                  Didn&apos;t receive a code?
                  <Link to="/forget-password" className="mx-2 text-blue-700">
                    resend
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </>
    );
  }
}

export default AuthCode;
