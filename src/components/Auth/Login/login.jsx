import React from "react";
import { Link, Navigate } from "react-router-dom";
import NavBar from "../../Content/nav";

class LoginForm extends React.Component {
  state = {
    redirectToBookingsHome: false,
    errors: {},
    apiError: null,
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email")?.toString().trim() || "";
    const password = formData.get("password")?.toString().trim() || "";
    const errors = {};

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

    try {
      const response = await fetch("http://localhost:8080/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        this.setState({
          apiError: data.error || "Login failed",
          errors: {},
        });
        return;
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      localStorage.setItem("username", data.user?.username || "");
      localStorage.setItem("email", data.user?.email || email);

      this.setState({
        apiError: null,
        errors: {},
        redirectToBookingsHome: true,
      });
    } catch (error) {
      console.error("Login request error:", error);
      this.setState({
        apiError: "Unable to connect to the login server.",
        errors: {},
      });
    }
  };

  getInputClass = (fieldName) =>
    `w-full border-b border-l-0 border-r-0 border-t-0 px-0 py-3 text-left text-base outline-none ${
      this.state.errors[fieldName]
        ? "border-red-500 text-red-900 placeholder-red-400"
        : "border-gray-300"
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
                <input
                  type="email"
                  name="email"
                  className={this.getInputClass("email")}
                  placeholder="email"
                  required
                />
                {this.state.errors.email && (
                  <p className="text-sm text-red-500">{this.state.errors.email}</p>
                )}
                <input
                  type="password"
                  name="password"
                  className={this.getInputClass("password")}
                  placeholder="password"
                  minLength="6"
                  required
                />
                {this.state.errors.password && (
                  <p className="text-sm text-red-500">{this.state.errors.password}</p>
                )}
                <div className="bg-white">
                  <p className="text-left font-sans font-normal text-md">
                    Do you have an
                    <Link to="/signup" className="text-blue-700 mx-2">
                      account
                    </Link>
                    ?
                  </p>
                  <p className="text-left font-sans font-normal text-md">
                    <Link to="/forget-password" className="capitalize text-blue-700">
                      forget password
                    </Link>
                  </p>
                </div>
                <button
                  type="submit"
                  className="cursor-pointer w-full rounded-none border-none bg-blue-700 px-6 py-3 text-base font-medium capitalize text-white sm:w-auto"
                >
                  login
                </button>
                {this.state.apiError && (
                  <p className="text-sm text-red-500">{this.state.apiError}</p>
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
