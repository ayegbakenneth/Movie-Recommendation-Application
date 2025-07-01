import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import { MovieProvider, MovieContext } from "./context/MovieContext";
import Footer from "./components/Footer";

const AppContent = () => {
  const { isLoggedIn, logout } = useContext(MovieContext);

  return (
    <div className="app-container">
      <Navbar isAuthenticated={isLoggedIn} onLogout={logout} />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <MovieProvider>
        <AppContent />
      </MovieProvider>
    </Router>
  );
};

export default App;