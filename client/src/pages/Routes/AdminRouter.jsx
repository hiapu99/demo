import { useState, useEffect } from "react";
import { useAuth } from "../../context/Auth";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import axios from "axios";

const AdminRouter = () => {
    const [ok, setOk] = useState(null); // null for initial state
    const { auth } = useAuth();
    const navigate = useNavigate(); // For redirection

    useEffect(() => {
        const authCheck = async () => {
            try {
                const res = await axios.get("http://localhost:9000/api/admin", {
                    headers: {
                        "Authorization": auth?.token
                    }
                });
                if (res.data.ok) {
                    setOk(true);
                } else {
                    setOk(false);
                    navigate("/signin"); // Redirect to signin if not authenticated
                }
            } catch (error) {
                console.error("Authentication check failed:", error);
                setOk(false);
                navigate("/signIn"); // Redirect to signin on error
            }
        };

        if (auth?.token) authCheck();
    }, [auth?.token, navigate]);

    if (ok === null) return <div>Loading...</div>;
    return ok ? <Outlet /> : <Navigate to="/signIn" />;
};

export default AdminRouter;
