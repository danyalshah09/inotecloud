import Notes from './Notes';
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Home = () => {
    const isLoggedIn = localStorage.getItem("auth-token") ? true : false;
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoggedIn) {
            // Redirect to login page if not logged in
            navigate("/login");
        }
    }, [isLoggedIn, navigate]);

    return (
        <div>
            {isLoggedIn ? <Notes /> : null} 
        </div>
    );
};

export default Home;
