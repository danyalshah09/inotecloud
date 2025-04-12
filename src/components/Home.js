import Notes from './Notes';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Home = () => {
    const isLoggedIn = localStorage.getItem("auth-token") ? true : false;
    const navigate = useNavigate();
    const [userName, setUserName] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isLoggedIn) {
            // Redirect to login page if not logged in
            navigate("/login");
        } else {
            // Get username
            const storedName = localStorage.getItem("user-name");
            setUserName(storedName || "");
            setLoading(false);
        }
    }, [isLoggedIn, navigate]);

    if (loading) {
        return (
            <div className="background-radial-gradient min-vh-100 d-flex justify-content-center align-items-center">
                <div className="spinner-border text-light" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="background-radial-gradient min-vh-100">
            <div className="container py-4">
                <div className="row">
                    <div className="col-12">
                        <div className="text-center text-white mb-5">
                            <h1 className="display-4 fw-bold mb-3">Welcome to iNoteCloud</h1>
                            {userName && <p className="lead mb-0">Hello, <span className="fw-bold" style={{ color: "hsl(218, 81%, 75%)" }}>{userName}</span>! Your digital notes, organized and secure.</p>}
                        </div>
                    </div>
                </div>
                
                {isLoggedIn ? <Notes /> : null}
                
                <footer className="mt-5 text-center text-white-50">
                    <p className="small mb-0">© 2024 iNoteCloud. All rights reserved.</p>
                </footer>
            </div>
        </div>
    );
};

export default Home;
