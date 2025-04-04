import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert } from "./Alert";

export const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [alert, setAlert] = useState({ visible: false, message: "", type: "" });

  const navigate = useNavigate(); // Hook for navigation

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = credentials;

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const json = await response.json();
      console.log("Login response:", json); // Log the entire response
      console.log("Login response type:", typeof json);
      console.log("Login response keys:", Object.keys(json));
      console.log("Name from response:", json.name);

      if (response.ok) {
        // Only show success alert if login is successful
        setAlert({
          visible: true,
          message: "Login successful!",
          type: "success",
        });

        // Hide the alert after 1 second
        setTimeout(() => {
          setAlert({ visible: false, message: "", type: "" });
        }, 1000);

        // Store token in localStorage or context
        localStorage.setItem("auth-token", json.authToken);
        const userName = json.name || "";
        console.log("Name before storage:", userName, typeof userName);
        localStorage.setItem("user-name", String(userName));
        console.log("Storing username in localStorage:", userName);

        // Delay the navigation to Home component by 3 seconds
        setTimeout(() => {
          navigate("/");
        }, 3000); // 3 seconds
      } else {
        // If the response is not OK, show error message
        setAlert({
          visible: true,
          message: "Invalid credentials!",
          type: "danger",
        });

        // Hide the alert after 1 second
        setTimeout(() => {
          setAlert({ visible: false, message: "", type: "" });
        }, 1000);
      }
    } catch (error) {
      console.error("Error during login:", error);
      setAlert({
        visible: true,
        message: "An error occurred. Please try again later.",
        type: "danger",
      });

      // Hide the alert after 1 second
      setTimeout(() => {
        setAlert({ visible: false, message: "", type: "" });
      }, 1000);
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
                      />
                      <label className="form-label" htmlFor="password">
                        Password
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary btn-block mb-4"
                    >
                      Sign in
                    </button>

                    <div className="text-center">
                      <button
                        type="button"
                        className="btn btn-link btn-floating mx-1"
                      >
                        <i className="fab fa-facebook-f"></i>
                      </button>

                      <button
                        type="button"
                        className="btn btn-link btn-floating mx-1"
                      >
                        <i className="fab fa-google"></i>
                      </button>

                      <button
                        type="button"
                        className="btn btn-link btn-floating mx-1"
                      >
                        <i className="fab fa-twitter"></i>
                      </button>

                      <button
                        type="button"
                        className="btn btn-link btn-floating mx-1"
                      >
                        <i className="fab fa-github"></i>
                      </button>
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
