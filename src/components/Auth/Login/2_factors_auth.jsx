import React from "react";
import { Link, Navigate } from "react-router-dom";
import NavBar from "../../Content/nav";
import { API_BASE_URL } from "../../../config/api";

class AuthCode extends React.Component {
  state = {
    errors: {},
    apiError: "",
    successMessage: "",
    codeVerified: false,
    redirectToLogin: false,
    isLoading: false,
    verifiedCode: "",
  };

  getEmail = () => sessionStorage.getItem("passwordResetEmail") || "";

  getCode = (formData) => {
    const d1 = formData.get("digit1")?.toString().trim() || "";
    const d2 = formData.get("digit2")?.toString().trim() || "";
    const d3 = formData.get("digit3")?.toString().trim() || "";
    const d4 = formData.get("digit4")?.toString().trim() || "";
    return d1 + d2 + d3 + d4;
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = this.getEmail();
    const code = this.getCode(formData);
    const errors = {};

    if (!email) {
      errors.code = "Start from the forgot password page so we know which email to verify.";
    } else if (!/^\d{4}$/.test(code)) {
      errors.code = "Enter the 4-digit code from your email.";
    }

    if (Object.keys(errors).length > 0) {
      this.setState({ errors, apiError: "" });
      return;
    }

    this.setState({ errors: {}, apiError: "", successMessage: "", isLoading: true });

    try {
      const response = await fetch(`${API_BASE_URL}/forgot-password/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, code }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.details || "Invalid verification code.");
      }

      this.setState({
        codeVerified: true,
        verifiedCode: code,
        successMessage: "Code verified. Enter your new password.",
        isLoading: false,
      });
    } catch (error) {
      this.setState({
        apiError: error.message || "Invalid verification code.",
        isLoading: false,
      });
    }
  };

  handlePasswordReset = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const password = formData.get("password")?.toString() || "";
    const confirmPassword = formData.get("confirmPassword")?.toString() || "";
    const email = this.getEmail();
    const errors = {};

    if (password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    } else if (password !== confirmPassword) {
      errors.password = "Passwords do not match.";
    }

    if (Object.keys(errors).length > 0) {
      this.setState({ errors, apiError: "" });
      return;
    }

    this.setState({ errors: {}, apiError: "", successMessage: "", isLoading: true });

    try {
      const response = await fetch(`${API_BASE_URL}/forgot-password/reset`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, code: this.state.verifiedCode, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.details || "Could not reset password.");
      }

      sessionStorage.removeItem("passwordResetEmail");
      this.setState({
        successMessage: "Password reset successfully. Redirecting to login...",
        isLoading: false,
      });

      window.setTimeout(() => this.setState({ redirectToLogin: true }), 1200);
    } catch (error) {
      this.setState({
        apiError: error.message || "Could not reset password.",
        isLoading: false,
      });
    }
  };

  getInputClass = () =>
    `h-14 w-14 border text-center text-xl outline-none sm:h-16 sm:w-16 ${
      this.state.errors.code ? "border-red-500 text-red-900" : "border-gray-300"
    }`;

  renderPasswordForm() {
    return (
      <form onSubmit={this.handlePasswordReset} className="mt-8 space-y-5">
        <input
          type="password"
          name="password"
          minLength="6"
          className="w-full border-b border-gray-300 px-0 py-3 text-base outline-none"
          placeholder="new password"
          required
        />
        <input
          type="password"
          name="confirmPassword"
          minLength="6"
          className="w-full border-b border-gray-300 px-0 py-3 text-base outline-none"
          placeholder="confirm password"
          required
        />
        {this.state.errors.password && (
          <p className="text-sm text-red-500">{this.state.errors.password}</p>
        )}
        <button
          type="submit"
          disabled={this.state.isLoading}
          className={`w-full cursor-pointer rounded-none border-none px-6 py-3 text-base font-medium capitalize text-white sm:w-auto ${
            this.state.isLoading ? "bg-gray-400" : "bg-blue-700"
          }`}
        >
          {this.state.isLoading ? "resetting..." : "reset password"}
        </button>
      </form>
    );
  }

  renderCodeForm() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="mt-8 flex items-center justify-between gap-3 sm:gap-4">
          <input type="text" name="digit1" inputMode="numeric" maxLength="1" pattern="[0-9]" className={this.getInputClass()} required />
          <input type="text" name="digit2" inputMode="numeric" maxLength="1" pattern="[0-9]" className={this.getInputClass()} required />
          <input type="text" name="digit3" inputMode="numeric" maxLength="1" pattern="[0-9]" className={this.getInputClass()} required />
          <input type="text" name="digit4" inputMode="numeric" maxLength="1" pattern="[0-9]" className={this.getInputClass()} required />
        </div>
        {this.state.errors.code && (
          <p className="mt-3 text-sm text-red-500">{this.state.errors.code}</p>
        )}
        <div className="mt-8 space-y-4">
          <button
            type="submit"
            disabled={this.state.isLoading}
            className={`w-full cursor-pointer rounded-none border-none px-6 py-3 text-base font-medium capitalize text-white sm:w-auto ${
              this.state.isLoading ? "bg-gray-400" : "bg-blue-700"
            }`}
          >
            {this.state.isLoading ? "verifying..." : "verify code"}
          </button>
          <p className="text-left font-sans text-md font-normal">
            Didn&apos;t receive a code?
            <Link to="/forget-password" className="mx-2 text-blue-700">
              resend
            </Link>
          </p>
        </div>
      </form>
    );
  }

  render() {
    if (this.state.redirectToLogin) {
      return <Navigate to="/login" replace />;
    }

    return (
      <>
        <NavBar />
        <div className="mt-16 min-h-screen bg-white px-4 py-10 sm:px-6 md:mt-3 md:flex md:items-center md:justify-center md:px-8">
          <div className="flex w-full justify-center">
            <div className="w-full max-w-md bg-white px-5 py-10 sm:px-8 md:rounded-none md:border md:border-gray-200 md:px-10 md:shadow-sm">
              <legend>
                <h3 className="py-2 text-left font-sans text-2xl font-medium capitalize sm:text-3xl">
                  two factor authentication
                </h3>
              </legend>
              <p className="mt-3 text-left font-sans text-sm text-gray-600">
                Enter the 4-digit verification code sent to your email.
              </p>
              {this.state.apiError && (
                <p className="mt-4 text-sm text-red-500 bg-red-50 p-2 border border-red-200">
                  {this.state.apiError}
                </p>
              )}
              {this.state.successMessage && (
                <p className="mt-4 text-sm text-green-700 bg-green-50 p-2 border border-green-200">
                  {this.state.successMessage}
                </p>
              )}
              {this.state.codeVerified ? this.renderPasswordForm() : this.renderCodeForm()}
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default AuthCode;
