import React from "react";
import { Link, Navigate } from "react-router-dom";
import NavBar from "../../../Content/nav";

class SignupForm extends React.Component {
  state = {
    errors: {},
    apiError: null,
    successMessage: null,
    redirectToBookingsHome: false,
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const fullName = formData.get("fullname")?.toString().trim() || "";
    const email = formData.get("email")?.toString().trim() || "";
    const password = formData.get("password")?.toString().trim() || "";
    const errors = {};

    if (!fullName) {
      errors.fullname = "Full name is required.";
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

    this.setState({ errors });
    // if no validation errors, submit to backend
    if (Object.keys(errors).length === 0) {
      this.setState({ apiError: null, successMessage: null });
      fetch("http://localhost:8080/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: fullName, email, password }),
      })
        .then(async (res) => {
          const data = await res.json().catch(() => ({}));
          if (res.ok) {
            if (data.token) {
              localStorage.setItem("token", data.token);
            }

            localStorage.setItem(
              "username",
              data.user?.username || fullName,
            );
            localStorage.setItem("email", data.user?.email || email);

            this.setState({
              successMessage: data.message || "Account created",
              redirectToBookingsHome: true,
            });
          } else {
            this.setState({ apiError: data.error || "Signup failed" });
          }
        })
        .catch((err) => {
          console.error("Signup request error:", err);
          this.setState({ apiError: "Network error" });
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
              className="w-full max-w-md bg-white px-5 py-10 sm:px-8 md:rounded-none md:border md:border-gray-200 md:px-10 md:shadow-sm"
            >
              <legend>
                <h3 className="py-2 text-center font-sans text-2xl font-medium capitalize sm:text-3xl">
                  sign up
                </h3>
              </legend>
              <div className="mt-6 space-y-6">
                <input
                  type="text"
                  name="fullname"
                  className={this.getInputClass("fullname")}
                  placeholder="full name"
                  required
                />
                {this.state.errors.fullname && (
                  <p className="text-sm text-red-500">
                    {this.state.errors.fullname}
                  </p>
                )}
                <input
                  type="email"
                  name="email"
                  className={this.getInputClass("email")}
                  placeholder="email"
                  required
                />
                {this.state.errors.email && (
                  <p className="text-sm text-red-500">
                    {this.state.errors.email}
                  </p>
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
                  <p className="text-sm text-red-500">
                    {this.state.errors.password}
                  </p>
                )}
                <p className="text-left font-sans text-md font-normal">
                  Already have an account?
                  <Link to="/login" className="mx-2 text-blue-700">
                    login
                  </Link>
                </p>
                <button
                  type="submit"
                  className="w-full cursor-pointer rounded-none border-none bg-blue-700 px-6 py-3 text-base font-medium capitalize text-white sm:w-auto"
                >
                  sign up
                </button>
                {this.state.apiError && (
                  <p className="mt-3 text-sm text-red-500">
                    {this.state.apiError}
                  </p>
                )}
                {this.state.successMessage && (
                  <p className="mt-3 text-sm text-green-600">
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
