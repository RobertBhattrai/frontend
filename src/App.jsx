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
import { UserProvider } from './context/UserContext';
import RequestBlood from "./pages/RequestBlood";
import MyRequest from "./pages/MyRequest";
import EditRequest from "./pages/EditRequest";
import EditProfile from "./pages/EditProfile";
import DonatePage from "./pages/DonatePage";

const App = () => {
  return (
    // <UserProvider>
      <Router>
      <UserProvider>
        <main>
          <Routes>
            {/* Landing page route */}
            <Route path="/" element={<Landing />} />

            {/* Authentication routes */}
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />

            {/* User-specific routes */}
            <Route path="/:username" element={<UserLayout />}>
              <Route path="home" element={<Home />} />
              <Route path="request" element={<RequestBlood />} />
              <Route path="myrequests" element={<MyRequest />} />
              <Route path="my-requests/edit/:id" element={<EditRequest />} />
              <Route path="profile" element={<EditProfile />} />
              <Route path="donate/:id" element={<DonatePage />} />
            </Route>
          </Routes>
        </main>
        </UserProvider>
      </Router>
    // </UserProvider>
  );
};

export default App;
