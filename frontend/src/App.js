import React, { useState, useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./components/Home";
import About from "./components/About";
import Layout from "./components/Layout";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import AdminDashboard from "./components/AdminDashboard";
import FindReferrals from "./components/FindReferrals";
import PostOpportunities from "./components/PostOpportunities";
import "./App.css";
import "./css/Home.css";
import "./css/About.css";
import "./css/Layout.css";
import "./css/Login.css";
import "./css/Register.css";
import "./css/Dashboard.css";
import "./css/FindReferrals.css";
import "./css/PostOpportunities.css";

const App = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser");
    if (storedUser) {
      setLoggedInUser(storedUser);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    setLoggedInUser(null);
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout loggedInUser={loggedInUser} handleLogout={handleLogout} />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/about",
          element: <About />,
        },
        {
          path: "/login",
          element: <Login setLoggedInUser={setLoggedInUser} />,
        },
        {
          path: "/register",
          element: <Register />,
        },
        {
          path: "/dashboard",
          element: <Dashboard />,
        },
        {
          path: "/find-referrals",
          element: <FindReferrals />
        },
        {
          path: "/post-opportunities",
          element: <PostOpportunities />
        },
        {
          path: "/admin-dashboard",
          element: <AdminDashboard />
        }
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;