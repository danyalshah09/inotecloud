import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Alert } from "./Alert";
import { toast } from 'react-toastify';

export const Signup = ({ setAlertMessage }) => {
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
    cpassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState({ visible: false, message: "", type: "" });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, cpassword } = credentials;

    if (!name.trim() || !email.trim() || !password.trim() || !cpassword.trim()) {
      setAlert({
        visible: true,
        message: "Please fill in all fields",
        type: "danger",
      });
      setTimeout(() => setAlert({ visible: false, message: "", type: "" }), 3000);
      return;
    }

    if (password !== cpassword) {
      setAlert({
        visible: true,
        message: "Passwords do not match",
        type: "danger",
      });
      setTimeout(() => setAlert({ visible: false, message: "", type: "" }), 3000);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/createuser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const json = await response.json();
      console.log("Signup response:", json);

      if (response.ok) {
        localStorage.setItem("auth-token", json.authToken);
        localStorage.setItem("user-name", name);
        
        setAlert({
          visible: true,
          message: "Account created successfully!",
          type: "success",
        });
        
        if (setAlertMessage) {
          setAlertMessage("Account created successfully!");
        }
        
        toast.success("Account created! Redirecting to home page...");

        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        const errorMessage = json.error || "Error creating account";
        setAlert({
          visible: true,
          message: errorMessage,
          type: "danger",
        });
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Error during signup:", error);
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
    <section className="background-radial-gradient overflow-hidden min-vh-100">
      {alert.visible && <Alert message={alert.message} type={alert.type} />}
      <div className="container px-4 py-5 px-md-5 text-center text-lg-start">
        <div className="row gx-lg-5 align-items-center">
          <div className="col-lg-6 mb-5 mb-lg-0" style={{ zIndex: 10 }}>
            <h1
              className="my-5 display-5 fw-bold ls-tight"
              style={{ color: "hsl(218, 81%, 95%)" }}
            >
              Join Our Community
              <br />
              <span style={{ color: "hsl(218, 81%, 75%)" }}>
                Take Your Notes to the Next Level
              </span>
            </h1>
            <p
              className="mb-4 opacity-70"
              style={{ color: "hsl(218, 81%, 85%)" }}
            >
              Create an account to unlock the full potential of iNoteCloud.
              Access your notes across devices, join discussions, and be part
              of our growing community of productivity enthusiasts.
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

            <div className="card bg-glass shadow-lg">
              <div className="card-body p-5">
                <h3 className="text-center mb-4">Create Account</h3>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      value={credentials.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      value={credentials.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      value={credentials.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="cpassword" className="form-label">Confirm Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="cpassword"
                      value={credentials.cpassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      required
                    />
                  </div>
                  <div className="d-grid">
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Creating Account...
                        </>
                      ) : (
                        "Sign Up"
                      )}
                    </button>
                  </div>
                  
                  <div className="text-center mt-4">
                    <p>Already have an account? <Link to="/login">Sign in</Link></p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
