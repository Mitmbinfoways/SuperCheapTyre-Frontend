import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import Tyre from './components/tyre/Tyre';
import About from './components/About/About';
import Blog from './components/Blog/Blog';
import BlogList from './components/Blog/BlogList';
import BlogDetail from './components/Blog/BlogDetail';
import PrivacyPolicy from './components/FooterPage/PrivacyPolicy';
import Terms from './components/FooterPage/Terms';
import { ContactUs } from './components/ContactUs/Contact';
import ProductDetail from './components/TyreProductDetails/ProductDetails';
import Cart from './components/Cart/Cart';
import Appointment from './components/Appointment/Appointment';
import Success from './components/Appointment/Success';
import Cancel from './components/Appointment/Cancel';
import NotFound from './components/common/NotFound';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ScrollToTopOnRouteChange() {
  const pathname = useLocation();
  useEffect(() => {
    const handleClick = (e) => {
      const target = e.target.closest("a");
      if (target && target.getAttribute("href") === window.location.pathname) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [pathname]);

  return null;
};

function App() {
  return (
    <div className="bg-[#F3F3F3]">
      <ScrollToTopOnRouteChange />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tyres" element={<Tyre />} />
        <Route path="/about" element={<About />} />
        <Route path="/blog" element={<BlogList />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path='/contactus' element={<ContactUs />} />
        <Route path='/productdetails/:id' element={<ProductDetail />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/appointment' element={<Appointment />} />
        <Route path='/success' element={<Success />} />
        <Route path='/cancel' element={<Cancel />} />
        {/* Catch-all route for 404 page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
      <ToastContainer />
    </div>
  );
}

export default App;