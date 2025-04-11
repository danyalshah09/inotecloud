import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import About from "./components/About";
import NoteState from "./context/notes/NoteState";
import { Signup } from "./components/Signup";
import { Login } from "./components/Login";
import Forum from "./components/Forum";

// Create a ProtectedRoute component
const ProtectedRoute = ({ element }) => {
  const isAuthenticated = !!localStorage.getItem("auth-token"); // Check auth token
  return isAuthenticated ? element : <Navigate to="/login" />;
};

function App() {
  return (
    <>
      <NoteState>
        <Router>
          <Navbar />
          <div className="container">
            <Routes>
              {/* Protect Home route */}
              <Route
                exact
                path="/"
                element={<ProtectedRoute element={<Home />} />}
              />
              <Route exact path="/about" element={<About />} />
              <Route exact path="/login" element={<Login />} />
              <Route exact path="/signup" element={<Signup />} />
              <Route exact path="/forum" element={<ProtectedRoute element={<Forum />} />} />
            </Routes>
          </div>
        </Router>
      </NoteState>
    </>
  );
}

export default App;