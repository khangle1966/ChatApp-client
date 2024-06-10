// Chat.js

import React, { useEffect, useState } from "react";
import Pusher from "pusher-js";
import { useNavigate } from "react-router-dom";
import "./Chat.scss";

function Chat() {
    const [username, setUsername] = useState('');
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        // Decode token to get username (if token is a JWT)
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        setUsername(decodedToken.unique_name);

        // Load messages from server
        const loadMessages = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/getmessages', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem("token")}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch messages');
                }
                const data = await response.json();
                setMessages(data);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        loadMessages();

        Pusher.logToConsole = true;

        const pusher = new Pusher('8ec6339cb89b7edf0ee4', {
            cluster: 'ap1'
        });

        const channel = pusher.subscribe('chat');
        channel.bind('message', function (data) {
            setMessages(prevMessages => [...prevMessages, data]);
        });
    }, [navigate]);

    const submit = async e => {
        e.preventDefault();

        await fetch('http://localhost:8000/api/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({
                username,
                message
            })
        });

        setMessage('');
    }

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    }

    return (
        <div className="container">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Welcome, {username}!</h2>
                <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
            </div>
            <div className="d-flex flex-column align-items-stretch flex-shrink-0 bg-white">
                <div className="d-flex align-items-center flex-shrink-0 p-3 link-dark text-decoration-none border-bottom">
                    <input className="fs-5 fw-semibold" value={username} onChange={e => setUsername(e.target.value)} readOnly />
                </div>
                <div className="list-group list-group-flush border-bottom scrollarea">
                    {messages.map((msg, index) => (
                        <div key={index} className="list-group-item list-group-item-action py-3 lh-tight">
                            <div className="d-flex w-100 align-items-center justify-content-between">
                                <div className="chatmessage">
                                    <strong className="mb-1">{msg.username}:</strong>
                                    <div className="chat">{msg.message}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <form onSubmit={submit}>
                <input className="form-control" placeholder="Write a message" value={message} onChange={e => setMessage(e.target.value)} />
            </form>
        </div>
    );
}

export default Chat;
