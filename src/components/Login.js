import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Alert } from "./Alert";

export const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [alert, setAlert] = useState({ visible: false, message: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setAlert({ visible: false, message: "", type: "" });

    try {
      const response = await fetch("https://inotebackend-nloj.onrender.com/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ email: credentials.email, password: credentials.password }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Server error (${response.status}):`, errorText);
        setAlert({
          visible: true,
          message: `Server error: ${response.status}. Please try again later.`,
          type: "danger",
        });
        return;
      }

      const json = await response.json();
      
      if (json.authToken) {
        localStorage.setItem("auth-token", json.authToken);
        localStorage.setItem("user-name", json.name);
        localStorage.setItem("user-id", json.userId);
        localStorage.setItem("user-email", json.email);
        navigate("/");
      } else {
        setAlert({
          visible: true,
          message: json.error || "Invalid credentials",
          type: "danger",
        });
      }
    } catch (error) {
      console.error("Error during login:", error);
      setAlert({
        visible: true,
        message: "Cannot connect to the server. Please check your internet connection or try again later.",
        type: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-vh-100 position-relative">
      <section className="background-radial-gradient overflow-hidden min-vh-100">
        <div className="container px-4 py-5 px-md-5 text-center text-lg-start">
          <div className="row gx-lg-5 align-items-center mb-5">
            <div className="col-lg-6 mb-5 mb-lg-0" style={{ zIndex: 10 }}>
              <h1
                className="my-4 display-5 fw-bold ls-tight"
                style={{ color: "hsl(218, 81%, 95%)" }}
              >
                Never Forget What's Important –
                <br />
                <span style={{ color: "hsl(218, 81%, 75%)" }}>
                  Your Notes, Always in Reach.
                </span>
              </h1>
              <p
                className="mb-4 opacity-70 d-none d-lg-block"
                style={{ color: "hsl(218, 81%, 85%)" }}
              >
                Streamline your workflow with our cutting-edge notes app.
                Securely organize, access, and manage your notes
                effortlessly—designed to boost productivity and drive success.
              </p>
            </div>

            <div className="col-lg-6 position-relative">
              <div className="card bg-glass shadow-lg">
                <div className="card-body p-4 p-md-5">
                  <h3 className="mb-4 text-center">Sign In</h3>
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

                    <div className="d-grid">
                      <button
                        type="submit"
                        className="btn btn-primary btn-lg"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Signing in...
                          </>
                        ) : (
                          "Sign in"
                        )}
                      </button>
                    </div>

                    {alert.visible && (
                      <div className="mt-3">
                        <Alert message={alert.message} type={alert.type} />
                      </div>
                    )}

                    <div className="text-center mt-3">
                      <p className="mb-0">Don't have an account? <Link to="/signup">Sign up</Link></p>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
