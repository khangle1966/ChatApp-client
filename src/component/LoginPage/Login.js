import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.scss"; // Import the SCSS file

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            navigate("/chat");
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); // Clear previous error messages
        const response = await fetch('http://localhost:8000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();
        if (response.ok) {
            localStorage.setItem("token", data.token);
            navigate('/chat');
        } else {
            setError(data.message); // Display error message
        }
    }

    return (
        <div className="containerlogin">
            <h2>Login</h2>
            {error && <div className="error">{error}</div>}
            <form onSubmit={handleSubmit}>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
                <div className="button-group">
                    <button type="submit">Login</button>
                    <button className="register-button" onClick={() => navigate('/register')}>Register</button>
                </div>
            </form>
        </div>
    );
}

export default Login;
