import React, { useState } from "react";
import { Alert } from "./Alert";
import { useNavigate } from "react-router-dom";

export const Signup = () => {
  const [formData, setFormData] = useState({
    name:"",
    email: "",
    password: "",
    cpassword: "",
  });
  const [alert, setAlert] = useState({ visible: false, message: "", type: "" });
  let navigate = useNavigate();

  const {name, email, password, cpassword } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== cpassword) {
      return alert("Passwords do not match!");
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/createuser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const json = await response.json();
      console.log(json);

      if (json.success) {
        localStorage.setItem("auth-token", json.authToken);
        localStorage.setItem("user-id", json.userId);
        localStorage.setItem("user-name", json.name);
        navigate("/");
      } else {
        setAlert({ visible: true, message: "Unable to create account!", type: "danger" });
        setTimeout(() => {
          setAlert({ visible: false, message: "", type: "" });
        }, 1000);
      }
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  return (
    <>
      {alert.visible && <Alert message={alert.message} type={alert.type} />}
      <div className="auth-container">
        <div className="auth-content">
          <div className="row gx-lg-5 align-items-center">
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
                        type="text"
                        id="name"
                        className="form-control"
                        value={name}
                        onChange={handleChange}
                        required
                      />
                      <label className="form-label" htmlFor="name">
                        Name
                      </label>
                    </div>

                    <div className="form-outline mb-4">
                      <input
                        type="email"
                        id="email"
                        className="form-control"
                        value={email}
                        onChange={handleChange}
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
                        value={password}
                        onChange={handleChange}
                        required
                      />
                      <label className="form-label" htmlFor="password">
                        Password
                      </label>
                    </div>

                    <div className="form-outline mb-4">
                      <input
                        type="password"
                        id="cpassword"
                        className="form-control"
                        value={cpassword}
                        onChange={handleChange}
                        required
                      />
                      <label className="form-label" htmlFor="cpassword">
                        Confirm Password
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary btn-block mb-4"
                    >
                      Sign Up
                    </button>

                    <div className="text-center">
                      <p>
                        Already have an account? <a href="/login">Login</a>
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
