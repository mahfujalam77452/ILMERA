import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Layouts & Pages
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Activities from "./pages/Activities";
import ActivityDetails from "./pages/ActivityDetails";
import Donation from "./pages/Donation";
import MakeDonation from "./pages/MakeDonation";
import Connect from "./pages/Connect";
import Gallery from "./pages/Gallery";
import Blogs from "./pages/Blogs";
import BlogDetails from "./pages/BlogDetails";
import Contact from "./pages/Contact";
import Payment from "./pages/Payment";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFail from "./pages/PaymentFail";
import About from "./pages/About";
import Notice from "./pages/Notice";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import AppealDetails from "./pages/AppealDetails";
import CurrentProject from "./pages/CurrentProject";
// Context
import { AppealsProvider } from "./context/AppealsContext";

function App() {
  return (
    <BrowserRouter>
      {/* Global Toast Notification Container */}
      <ToastContainer position="top-right" autoClose={3000} />

      {/* PERFORMANCE NOTE: 
        Wrapping Routes here is efficient. The API is called once. 
        Data is passed down to Header (inside MainLayout) and Home 
        without prop-drilling or duplicate API calls.
      */}
      <AppealsProvider>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />

            {/* Activities */}
            <Route path="activities" element={<Activities />} />
            <Route path="activities/:slug" element={<ActivityDetails />} />

            {/* Donation */}
            <Route path="donation" element={<Donation />} />
            <Route path="make-donation" element={<MakeDonation />} />

            {/* Volunteer / Connect */}
            <Route path="connect" element={<Connect />} />

            {/* Gallery */}
            <Route path="gallery" element={<Gallery />} />

            {/* Blogs */}
            <Route path="blogs" element={<Blogs />} />
            <Route path="blogs/:slug" element={<BlogDetails />} />

            {/* Contact & Legal */}
            <Route path="contact" element={<Contact />} />
            <Route path="payment" element={<Payment />} />
            <Route path="payment-success" element={<PaymentSuccess />} />
            <Route path="payment-fail" element={<PaymentFail />} />
            <Route path="about-us" element={<About />} />
            <Route path="/notice" element={<Notice />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />

            {/* Appeals Route */}
            <Route path="appeals/:slug" element={<AppealDetails />} />
            <Route path="current-project" element={<CurrentProject />} />
          </Route>
        </Routes>
      </AppealsProvider>
    </BrowserRouter>
  );
}

export default App;
