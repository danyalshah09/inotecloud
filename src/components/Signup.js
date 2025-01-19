import React, { useState } from "react";
import { Alert } from "./Alert";

export const Signup = () => {
  const [formData, setFormData] = useState({
    name:"",
    email: "",
    password: "",
    cpassword: "",
  });
  const [alert, setAlert] = useState({ visible: false, message: "", type: "" });

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
        setAlert({ visible: true, message: "Account created successfully", type: "success" });
        setTimeout(() => {
          setAlert({ visible: false, message: "", type: "" });
        }, 1000);
      } else {
          // If the response is not OK, show error message
          setAlert({ visible: true, message: "Unable to create account!", type: "danger" });

          // Hide the alert after 1 second
          setTimeout(() => {
            setAlert({ visible: false, message: "", type: "" });
          }, 1000);
      }
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  return (
    <>  {alert.visible && <Alert message={alert.message} type={alert.type} />}
  
  <section className="w-100 background-radial-gradient overflow-hidden">
  <div className="container-fluid h-100 px-4 py-5 px-md-5 text-center text-lg-start my-5">
    <div className="row gx-lg-5 align-items-center mb-5 h-100">
   

      <div className="col-lg-6 mb-5 mb-lg-0 position-relative h-100">
        <div id="radius-shape-2" className="position-absolute shadow-5-strong"></div>

        <div className="z- card bg-glass h-100">
          <div className="card-body px-4 py-5 px-md-5">
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
                <label className="form-label" htmlFor="name">Name</label>
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
                <label className="form-label" htmlFor="email">Email address</label>
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
                <label className="form-label" htmlFor="password">Password</label>
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
                <label className="form-label" htmlFor="cpassword">Confirm Password</label>
              </div>
              <button type="submit" className="btn btn-primary btn-block mb-4">Sign Up</button>
            </form>
          </div>
        </div>
      </div>

      <div className="col-lg-6 mb-5 mb-lg-0" style={{ zIndex: 10 }}>
        
  
        <p className="mb-4 opacity-70" style={{ color: "hsl(218, 81%, 85%)" }}>
          Streamline your workflow with our cutting-edge notes app. Securely organize, access, and manage your notes effortlessly—designed to boost productivity and drive success.
        </p>
        <div id="radius-shape-1" className="position-absolute rounded-circle shadow-5-strong"></div>

      </div>
      
    </div>
  </div>
</section>


    </>
  );
};
