import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert } from "./Alert";
import { toast } from 'react-toastify';
import { parseToken } from "../utils/tokenHelper";

export const Login = ({ setAlertMessage }) => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState({ visible: false, message: "", type: "" });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = credentials;

    if (!email.trim() || !password.trim()) {
      setAlert({
        visible: true,
        message: "Please enter both email and password",
        type: "danger",
      });
      setTimeout(() => setAlert({ visible: false, message: "", type: "" }), 3000);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const json = await response.json();
      console.log("Login response:", json);

      if (response.ok) {
        localStorage.setItem("auth-token", json.authToken);
        const userName = json.name || "";
        localStorage.setItem("user-name", String(userName));
        
        const parsedToken = parseToken(json.authToken);
        if (parsedToken && parsedToken.user && parsedToken.user.id) {
          localStorage.setItem("user-id", parsedToken.user.id);
        }
        
        setAlert({
          visible: true,
          message: `Welcome back, ${userName}!`,
          type: "success",
        });
        
        if (setAlertMessage) {
          setAlertMessage(`Welcome back, ${userName}!`);
        }
        
        toast.success("Login successful! Redirecting to home page...");

        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        const errorMessage = json.error || "Invalid credentials!";
        setAlert({
          visible: true,
          message: errorMessage,
          type: "danger",
        });
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Error during login:", error);
      setAlert({
        visible: true,
        message: "Server connection error. Please try again later.",
        type: "danger",
      });
      toast.error("Unable to connect to the server. Please check your internet connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {alert.visible && <Alert message={alert.message} type={alert.type} />}
      <div className="auth-container">
        <div className="auth-content">
          <div className="row gx-lg-5 align-items-center">
            <div className="col-lg-6 mb-5 mb-lg-0" style={{ zIndex: 10 }}>
              <h1 className="my-5 display-5 fw-bold ls-tight">
                <span className="text-primary">iNoteCloud</span>
              </h1>
              <h2 className="mb-4">Login</h2>
              <p className="mb-4 opacity-70">
                Welcome back! Please enter your credentials to access your notes.
              </p>
            </div>

            <div className="col-lg-6 mb-5 mb-lg-0 position-relative">
              <div className="card bg-glass">
                <div className="card-body px-4 py-5 px-md-5">
                  <form onSubmit={handleSubmit}>
                    <div className="form-outline mb-4">
                      <label className="form-label" htmlFor="email">
                        Email address
                      </label>
                      <input
                        type="email"
                        id="email"
                        className="form-control"
                        value={credentials.email}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="form-outline mb-4">
                      <label className="form-label" htmlFor="password">
                        Password
                      </label>
                      <input
                        type="password"
                        id="password"
                        className="form-control"
                        value={credentials.password}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary btn-block mb-4 w-100"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Signing in..." : "Sign in"}
                    </button>

                    <div className="text-center">
                      <p>
                        Don't have an account?{" "}
                        <a href="/signup" className="text-primary">
                          Sign up
                        </a>
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
