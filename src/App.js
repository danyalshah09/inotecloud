import "./App.css";
import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import About from "./components/About";
import NoteState from "./context/notes/NoteState";
import MessageState from "./context/messages/MessageState";
import { Alert } from "./components/Alert";
import { Login } from "./components/Login";
import { Signup } from "./components/Signup";
import Forum from "./components/Forum";
import { isTokenValid, isTokenAboutToExpire, clearAuthData } from './utils/tokenHelper';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Session checker component
const SessionChecker = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check token validity
    if (localStorage.getItem("auth-token") && !isTokenValid()) {
      // Token is invalid or expired
      toast.error("Your session has expired. Please log in again.");
      clearAuthData();
      navigate("/login");
    } else if (isTokenAboutToExpire()) {
      // Token is about to expire
      toast.warning("Your session will expire soon. Please log in again to continue.", {
        autoClose: 10000, // 10 seconds
      });
    }
    
    // Set up periodic checks
    const intervalId = setInterval(() => {
      if (localStorage.getItem("auth-token") && !isTokenValid()) {
        toast.error("Your session has expired. Please log in again.");
        clearAuthData();
        navigate("/login");
      }
    }, 60000); // Check every minute
    
    return () => clearInterval(intervalId);
  }, [navigate]);
  
  return null;
};

function App() {
  const [alertMessage, setAlertMessage] = useState("Notes at your fingertip");

  return (
    <>
      <NoteState>
        <MessageState>
          <Router>
            <SessionChecker />
            <Navbar />
            <Alert message={alertMessage} />
            <ToastContainer position="top-right" />
            <div className="container">
              <Routes>
                <Route exact path="/" element={<Home />} />
                <Route exact path="/about" element={<About />} />
                <Route exact path="/login" element={<Login setAlertMessage={setAlertMessage} />} />
                <Route exact path="/signup" element={<Signup setAlertMessage={setAlertMessage} />} />
                <Route exact path="/forum" element={<Forum />} />
              </Routes>
            </div>
          </Router>
        </MessageState>
      </NoteState>
    </>
  );
}

export default App;