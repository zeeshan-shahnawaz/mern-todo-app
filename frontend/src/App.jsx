import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import TodoList from "./components/TodoList";
import ProtectedRoute from "./components/ProtectedRoute";
import './styles.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route 
            path="/todos" 
            element={
              <ProtectedRoute>
                <TodoList />
              </ProtectedRoute>
            } 
          />
        </Routes>
        <footer className="copyright-footer">
          <p>© 2025 MERN Todo App - Developed by Zeeshan Shah</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
  