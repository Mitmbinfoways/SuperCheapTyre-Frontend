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
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ScrollToTopOnRouteChange() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [location.pathname]);
  return null;
}

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
        <Route path="/privacy" element={<PrivacyPolicy/>} />
        <Route path="/terms" element={<Terms/>} />
        <Route path='/contactus' element={<ContactUs/>}/>
        <Route path='/productdetails/:id' element={<ProductDetail/>}/>
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/appointment' element={<Appointment/>}/>
        <Route path='/success' element={<Success/>}/>
        <Route path='/cancel' element={<Cancel/>}/>
      </Routes>
      <Footer />
      <ToastContainer position="top-right" newestOnTop />
    </div>
  );
}

export default App;