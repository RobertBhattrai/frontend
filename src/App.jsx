import "./index.css";
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import LandingHeader from "./components/LandingHeader";
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Home from './pages/Home';
import Register from './pages/Auth/Register';
import Login from './pages/Auth/Login';
import UserLayout from "./layout/UserLayout";

const App = () => {
  return (
    <Router>
      {/* <Header /> */}
      <main>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/user" element={<UserLayout />}>
          <Route path="home" element={<Home />} />
          </Route>
        </Routes>
      </main>
    </Router>
  );
};

export default App;
