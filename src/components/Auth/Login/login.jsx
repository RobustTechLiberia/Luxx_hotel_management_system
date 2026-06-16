import React from "react";
import { Link, Navigate } from "react-router-dom";

const NavBar = () => (
  <nav className="w-full bg-gray-800 text-white p-4 text-center font-sans">
    Luxx Bookings Navigation
  </nav>
);

class LoginForm extends React.Component {
  state = {
    redirectToBookingsHome: false,
    errors: {},
    apiError: null,
  };

  handleSubmit = (event) => {
    event.preventDefault();
    
    // Clear out previous errors on every click so old messages clear out
    this.setState({ errors: {}, apiError: null });

    const formData = new FormData(event.currentTarget);
    
    // Sanitize string data safely to prevent casing errors
    const email = formData.get("email")?.toString().trim().toLowerCase() || "";
    const password = formData.get("password")?.toString().trim() || "";
    const errors = {};

    // 1. Client-Side Input Form Validation
    if (!email) {
      errors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Enter a valid email address.";
    }

    if (!password) {
      errors.password = "Password is required.";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    }

    if (Object.keys(errors).length > 0) {
      this.setState({ errors });
      return;
    }

    // 2. EXCLUSIVE LOCAL SYSTEM CREDENTIALS CHECK
    if (email === "admin@example.com" && password === "password@123") {
      // Seed browser context values
      localStorage.setItem("token", "mock-fallback-token-xyz123");
      localStorage.setItem("username", "admin");
      localStorage.setItem("email", email);

      // Trigger standard routing state mutation
      this.setState({
        apiError: null,
        errors: {},
        redirectToBookingsHome: true,
      });
    } else {
      // Terminate routine locally with a standard visibility error message
      this.setState({
        apiError: "Invalid email or password.",
      });
    }
  };

  getInputClass = (fieldName) =>
    `w-full border-b border-l-0 border-r-0 border-t-0 px-0 py-3 text-left text-base outline-none transition-colors ${
      this.state.errors[fieldName]
        ? "border-red-500 text-red-900 placeholder-red-400 focus:border-red-500"
        : "border-gray-300 focus:border-blue-700"
    }`;

  render() {
    if (this.state.redirectToBookingsHome) {
      return <Navigate to="/bookings" replace />;
    }

    return (
      <>
        <NavBar />
        <div className="mt-16 min-h-screen bg-white px-4 py-10 sm:px-6 md:mt-3 md:flex md:items-center md:justify-center md:px-8">
          <div className="flex w-full justify-center">
            <form
              onSubmit={this.handleSubmit}
              className="w-full max-w-md md:rounded-none md:border md:border-gray-200 bg-white px-5 py-10 md:shadow-sm sm:px-8 md:px-10"
            >
              <legend>
                <h3 className="py-2 text-center font-sans text-2xl font-medium capitalize sm:text-3xl">
                  login
                </h3>
              </legend>
              
              <div className="mt-6 space-y-6">
                {/* Email Field */}
                <div>
                  <input
                    type="email"
                    name="email"
                    className={this.getInputClass("email")}
                    placeholder="Email Address"
                    required
                  />
                  {this.state.errors.email && (
                    <p className="mt-1 text-sm text-red-500">{this.state.errors.email}</p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <input
                    type="password"
                    name="password"
                    className={this.getInputClass("password")}
                    placeholder="Password"
                    minLength="6"
                    required
                  />
                  {this.state.errors.password && (
                    <p className="mt-1 text-sm text-red-500">{this.state.errors.password}</p>
                  )}
                </div>

                {/* Secondary Links */}
                <div className="bg-white space-y-1">
                  <p className="text-left font-sans font-normal text-md text-gray-600">
                    Do you have an
                    <Link to="/signup" className="text-blue-700 mx-1 hover:underline">
                      account
                    </Link>
                    ?
                  </p>
                  <p className="text-left font-sans font-normal text-md">
                    <Link to="/forget-password" className="capitalize text-blue-700 hover:underline">
                      forget password
                    </Link>
                  </p>
                </div>

                {/* Form Action Button */}
                <button
                  type="submit"
                  className="cursor-pointer w-full rounded-none border-none bg-blue-700 px-6 py-3 text-base font-medium capitalize text-white hover:bg-blue-800 transition-colors sm:w-auto"
                >
                  login
                </button>

                {/* Explicit local error notification banner */}
                {this.state.apiError && (
                  <p className="mt-2 text-sm text-red-500 bg-red-50 p-2 border border-red-200 text-center rounded">
                    {this.state.apiError}
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      </>
    );
  }
}

export default LoginForm;