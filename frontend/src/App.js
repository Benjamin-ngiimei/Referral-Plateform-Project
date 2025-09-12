import React, { useState, useEffect } from "react";
import { createBrowserRouter, RouterProvider, useNavigate } from "react-router-dom";
import Home from "./components/Home";
import About from "./components/About";
import Layout from "./components/Layout";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import AdminDashboard from "./components/AdminDashboard";
import FindReferrals from "./components/FindReferrals";
import PostOpportunities from "./components/PostOpportunities";
import EditOpportunity from "./components/EditOpportunity";
import Features from "./components/Features";
import HowItWork from "./components/HowItWork";
import Contact from "./components/Contact";
import "./App.css";
import "./css/Home.css";
import "./css/About.css";
import "./css/Layout.css";
import "./css/Login.css";
import "./css/Register.css";
import "./css/Dashboard.css";
import "./css/FindReferrals.css";
import "./css/PostOpportunities.css";



function AppWithNavigate() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser");
    if (storedUser) {
      setLoggedInUser(storedUser);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("referral_key");
    localStorage.removeItem("loggedInUserEmail");
    setLoggedInUser(null);
    window.location.href = "/";
  };

  return (
    <Layout loggedInUser={loggedInUser} handleLogout={handleLogout} />
  );
}


function AdminRouteWrapper() {
  const navigate = useNavigate();
  const referralKey = localStorage.getItem('referral_key');
  const isAdmin = localStorage.getItem('admin') === 'true';

  console.log('AdminRouteWrapper: referralKey', referralKey);
  console.log('AdminRouteWrapper: isAdmin', isAdmin);

  useEffect(() => {
    if (!referralKey || !isAdmin) {
      console.log('AdminRouteWrapper: Redirecting to login');
      navigate('/login');
    }
  }, [referralKey, isAdmin, navigate]);

  return referralKey && isAdmin ? <AdminDashboard /> : null;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppWithNavigate />, 
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
        element: <AppLoginWrapper />,
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
        element: <AdminRouteWrapper />
      },
      {
        path: "/admin/edit-opportunity/:id",
        element: <EditOpportunity />
      },
      {
        path: "/features",
        element: <Features />,
      },
      {
        path: "/how-it-work",
        element: <HowItWork />,
      },
      {
        path: "/contact",
        element: <Contact />,
      }
    ],
  },
]);

function AppLoginWrapper() {
  const navigate = useNavigate();
  const [loggedInUser, setLoggedInUser] = React.useState(localStorage.getItem("loggedInUser") || null);
  const isAdmin = localStorage.getItem('admin') === 'true';

  console.log('AppLoginWrapper: loggedInUser', loggedInUser);
  console.log('AppLoginWrapper: isAdmin', isAdmin);

  useEffect(() => {
    if (loggedInUser) {
      if (isAdmin) {
        console.log('AppLoginWrapper: Redirecting to admin dashboard');
        navigate("/admin-dashboard");
      } else {
        console.log('AppLoginWrapper: Redirecting to user dashboard');
        navigate("/dashboard");
      }
    }
  }, [loggedInUser, isAdmin, navigate]);
  return <Login setLoggedInUser={setLoggedInUser} />;
}

function App() {
  return <RouterProvider router={router} />;
}

export default App;