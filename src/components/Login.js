import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
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
      if (response.ok) {
        // Store token in localStorage or context
        localStorage.setItem("auth-token", json.authToken);
        alert("Login successful!");
        console.log("Token:", json.authToken);

        // Navigate to Home component
        navigate("/");
      } else {
        alert(json.error || "Invalid credentials!");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <div className="container w-50 border border-primary my-4">
      <form className="container my-4" onSubmit={handleSubmit}>
        <div data-mdb-input-init className="form-outline mb-4">
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

        <div data-mdb-input-init className="form-outline mb-4">
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

        <button type="submit" className="btn btn-primary btn-block mb-4">
          Sign in
        </button>
      </form>
    </div>
  );
};
