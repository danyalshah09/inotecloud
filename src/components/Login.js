import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert } from "./Alert";
import { toast } from 'react-toastify';
import { parseToken } from "../utils/tokenHelper";

export const Login = ({ setAlertMessage }) => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState({ visible: false, message: "", type: "" });

  const navigate = useNavigate(); // Hook for navigation

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
        // Store token in localStorage
        localStorage.setItem("auth-token", json.authToken);
        
        // Store username
        const userName = json.name || "";
        localStorage.setItem("user-name", String(userName));
        
        // Parse token and store user ID
        const parsedToken = parseToken(json.authToken);
        if (parsedToken && parsedToken.user && parsedToken.user.id) {
          localStorage.setItem("user-id", parsedToken.user.id);
          console.log("Stored user ID:", parsedToken.user.id);
        }
        
        // Set success messages
        setAlert({
          visible: true,
          message: `Welcome back, ${userName}!`,
          type: "success",
        });
        
        if (setAlertMessage) {
          setAlertMessage(`Welcome back, ${userName}!`);
        }
        
        toast.success("Login successful! Redirecting to home page...");

        // Navigate to home after a short delay
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        // Handle error response
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
      <section className="w-10 background-radial-gradient overflow-hidden">
        <div className="w-100 container px-4 py-5 px-md-5 text-center text-lg-start my-5">
          <div className="row gx-lg-5 align-items-center mb-5">
            <div className="col-lg-6 mb-5 mb-lg-0" style={{ zIndex: 10 }}>
              <h1
                className="my-5 display-5 fw-bold ls-tight"
                style={{ color: "hsl(218, 81%, 95%)" }}
              >
                Never Forget What's Important –
                <br />
                <span style={{ color: "hsl(218, 81%, 75%)" }}>
                  Your Notes, Always in Reach.
                </span>
              </h1>
              <p
                className="mb-4 opacity-70"
                style={{ color: "hsl(218, 81%, 85%)" }}
              >
                Streamline your workflow with our cutting-edge notes app.
                Securely organize, access, and manage your notes
                effortlessly—designed to boost productivity and drive success.
              </p>
            </div>

            <div className="col-lg-6 mb-5 mb-lg-0 position-relative">
              <div
                id="radius-shape-1"
                className="position-absolute rounded-circle shadow-5-strong"
              ></div>
              <div
                id="radius-shape-2"
                className="position-absolute shadow-5-strong"
              ></div>

              <div className="card bg-glass">
                <div className="card-body px-4 py-5 px-md-5">
                  <form onSubmit={handleSubmit}>
                    <div className="form-outline mb-4">
                      <input
                        type="email"
                        id="email"
                        className="form-control"
                        value={credentials.email}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        required
                      />
                      <label className="form-label" htmlFor="email">
                        Email address
                      </label>
                    </div>

                    <div className="form-outline mb-4">
                      <input
                        type="password"
                        id="password"
                        className="form-control"
                        value={credentials.password}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        required
                      />
                      <label className="form-label" htmlFor="password">
                        Password
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary btn-block mb-4"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Signing in...
                        </>
                      ) : (
                        "Sign in"
                      )}
                    </button>

                    <div className="text-center">
                      <p>
                        Don't have an account? <a href="/signup">Sign up</a>
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
