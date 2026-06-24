import React from "react";
import { Link, Navigate } from "react-router-dom";
import NavBar from "../../../Content/nav";
import { API_BASE_URL } from "../../../../config/api";


class SignupForm extends React.Component {
  state = {
    errors: {},
    apiError: null,
    successMessage: null,
    redirectToBookingsHome: false,
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    
    // Reset notification alerts on each new submission attempt
    this.setState({ errors: {}, apiError: null, successMessage: null });

    const formData = new FormData(event.currentTarget);
    const fullName = formData.get("fullname")?.toString().trim() || "";
    const email = formData.get("email")?.toString().trim().toLowerCase() || "";
    const password = formData.get("password")?.toString().trim() || "";
    const errors = {};

    // 1. Enhanced Client-Side Validation
    if (!fullName) {
      errors.fullname = "Full name is required.";
    } else if (fullName.length < 3) {
      errors.fullname = "Name must be at least 3 characters long.";
    }

    if (!email) {
      errors.email = "Email address is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Enter a valid email address.";
    }

    if (!password) {
      errors.password = "Password is required.";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    }

    // Set errors state and halt process if validations fail
    if (Object.keys(errors).length > 0) {
      this.setState({ errors });
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          username: fullName,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.details || "Signup failed.");
      }

      localStorage.setItem("token", data.token || "");
      localStorage.setItem("username", data.user?.username || fullName);
      localStorage.setItem("email", data.user?.email || email);
      localStorage.setItem("useremail", data.user?.email || email);

      this.setState({
        successMessage: "Account created successfully!",
        redirectToBookingsHome: true,
      });
    } catch (error) {
      this.setState({
        apiError: error.message || "Could not create your account.",
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
              className="w-full max-w-md bg-white px-5 py-10 sm:px-8 md:rounded-none md:border md:border-gray-200 md:px-10 md:shadow-sm"
            >
              <legend>
                <h3 className="py-2 text-center font-sans text-2xl font-medium capitalize sm:text-3xl">
                  sign up
                </h3>
              </legend>
              <div className="mt-6 space-y-6">
                {/* Full Name Input Field */}
                <div>
                  <input
                    type="text"
                    name="fullname"
                    className={this.getInputClass("fullname")}
                    placeholder="Full Name"
                    required
                  />
                  {this.state.errors.fullname && (
                    <p className="mt-1 text-sm text-red-500">
                      {this.state.errors.fullname}
                    </p>
                  )}
                </div>

                {/* Email Input Field */}
                <div>
                  <input
                    type="email"
                    name="email"
                    className={this.getInputClass("email")}
                    placeholder="Email Address"
                    required
                  />
                  {this.state.errors.email && (
                    <p className="mt-1 text-sm text-red-500">
                      {this.state.errors.email}
                    </p>
                  )}
                </div>

                {/* Password Input Field */}
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
                    <p className="mt-1 text-sm text-red-500">
                      {this.state.errors.password}
                    </p>
                  )}
                </div>

                <p className="text-left font-sans text-md font-normal">
                  Already have an account?
                  <Link to="/login" className="mx-2 text-blue-700 hover:underline">
                    login
                  </Link>
                </p>

                <button
                  type="submit"
                  className="w-full cursor-pointer rounded-none border-none bg-blue-700 px-6 py-3 text-base font-medium capitalize text-white hover:bg-blue-800 transition-colors sm:w-auto"
                >
                  sign up
                </button>

                {/* Local Feedback Messaging Containers */}
                {this.state.apiError && (
                  <p className="mt-3 text-sm text-red-500 bg-red-50 p-2 border border-red-200 text-center rounded">
                    {this.state.apiError}
                  </p>
                )}
                {this.state.successMessage && (
                  <p className="mt-3 text-sm text-green-600 bg-green-50 p-2 border border-green-200 text-center rounded">
                    {this.state.successMessage}
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

export default SignupForm;

