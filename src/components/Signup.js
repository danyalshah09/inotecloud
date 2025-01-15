import React, { useState } from "react";

export const Signup = () => {
  const [formData, setFormData] = useState({
    name:"",
    email: "",
    password: "",
    cpassword: "",
  });

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
        body: JSON.stringify({ name,email, password}), // Replace "User Name" with actual user input if needed
      });

      const result = await response.json();

      if (response.status === 201) {
        alert("User created successfully!");
      } else {
        alert(`Error: ${result.error || result.message}`);
      }
    } catch (error) {
      console.error("Error creating user:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="container w-50 border border-primary my-4">
      <form className="container my-4" onSubmit={handleSubmit}>
      <div className="form-outline mb-4">
          <input
            type="name"
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

        <button type="submit" className="btn btn-primary btn-block mb-4">
          Sign Up
        </button>
      </form>
    </div>
  );
};
