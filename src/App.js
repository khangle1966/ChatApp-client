import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './component/RegisterPage/Register';
import Login from './component/LoginPage/Login';
import Chat from './component/Chatpage/Chat';
import ProtectedRoute from './component/ProtectedRoute/ProtectedRoute';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/chat" element={<ProtectedRoute element={Chat} />} />
            </Routes>
        </Router>
    );
}

export default App;
