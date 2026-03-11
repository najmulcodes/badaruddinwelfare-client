import React from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";

import Header from "./components/Header.js";
import Footer from "./components/Footer.js";
import PrivateRoute from "./components/PrivateRoute.js";
import PortalLayout from "./components/PortalLayout.js";

// Public pages
import Home from "./pages/public/Home.js";
import About from "./pages/public/About.js";
import OurWork from "./pages/public/OurWork.js";
import RequestHelp from "./pages/public/RequestHelp.js";
import Contact from "./pages/public/Contact.js";
import NotFound from "./pages/NotFound.js";

// Portal pages
import Login from "./pages/portal/Login.js";
import Dashboard from "./pages/portal/Dashboard.js";
import DonationLog from "./pages/portal/DonationLog.js";
import SpendingLog from "./pages/portal/SpendingLog.js";
import HelpRequests from "./pages/portal/HelpRequests.js";
import Messages from "./pages/portal/Messages.js";
import AdminPanel from "./pages/portal/AdminPanel.js";
import NewsManage from "./pages/portal/NewsManage.js";

// Public layout wrapper (Header + Footer)
const PublicLayout = () => (
  <div className="flex flex-col min-h-screen">
    <Header />
    <main className="flex-1">
      <Outlet />
    </main>
    <Footer />
  </div>
);

// Portal wrapper (no header/footer — PortalLayout handles its own sidebar)
const PortalWrapper = ({ children, adminOnly = false }) => (
  <PrivateRoute adminOnly={adminOnly}>
    <PortalLayout>{children}</PortalLayout>
  </PrivateRoute>
);

const router = createBrowserRouter([
  // ── Public routes ──────────────────────────────────────────────────────────
  {
    element: <PublicLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/about", element: <About /> },
      { path: "/our-work", element: <OurWork /> },
      { path: "/request-help", element: <RequestHelp /> },
      { path: "/contact", element: <Contact /> },
      { path: "/login", element: <Login /> },
      { path: "*", element: <NotFound /> },
    ],
  },

  // ── Private member portal routes ───────────────────────────────────────────
  {
    path: "/portal/dashboard",
    element: <PortalWrapper><Dashboard /></PortalWrapper>,
  },
  {
    path: "/portal/donations",
    element: <PortalWrapper><DonationLog /></PortalWrapper>,
  },
  {
    path: "/portal/spending",
    element: <PortalWrapper><SpendingLog /></PortalWrapper>,
  },
  {
    path: "/portal/help-requests",
    element: <PortalWrapper><HelpRequests /></PortalWrapper>,
  },
  {
    path: "/portal/messages",
    element: <PortalWrapper><Messages /></PortalWrapper>,
  },
  {
    path: "/portal/news-manage",
    element: <PortalWrapper><NewsManage /></PortalWrapper>,
  },
  {
    path: "/portal/admin",
    element: <PortalWrapper adminOnly={true}><AdminPanel /></PortalWrapper>,
  },
]);

export default function App() {
  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#fff",
            color: "#1f2937",
            borderRadius: "10px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            fontWeight: 500,
          },
          success: { iconTheme: { primary: "#10b981", secondary: "#fff" } },
          error: { iconTheme: { primary: "#ef4444", secondary: "#fff" } },
        }}
      />
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
