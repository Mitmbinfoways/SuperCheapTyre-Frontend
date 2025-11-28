import React, { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Loader from './components/common/Loader';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useGlobalImageOptimization from './hooks/useGlobalImageOptimization';

const Home = lazy(() => import('./components/Home'));
const Tyre = lazy(() => import('./components/tyre/Tyre'));
const Wheels = lazy(() => import('./components/tyre/Wheels'));
const About = lazy(() => import('./components/About/About'));
const BlogList = lazy(() => import('./components/Blog/BlogList'));
const BlogDetail = lazy(() => import('./components/Blog/BlogDetail'));
const Service = lazy(() => import('./components/Service/Service'));
const PrivacyPolicy = lazy(() => import('./components/FooterPage/PrivacyPolicy'));
const Terms = lazy(() => import('./components/FooterPage/Terms'));
const ContactUs = lazy(() =>
  import('./components/ContactUs/Contact').then((module) => ({ default: module.ContactUs }))
);
const ProductDetail = lazy(() => import('./components/TyreProductDetails/ProductDetails'));
const Cart = lazy(() => import('./components/Cart/Cart'));
const Appointment = lazy(() => import('./components/Appointment/Appointment'));
const Success = lazy(() => import('./components/Appointment/Success'));
const Cancel = lazy(() => import('./components/Appointment/Cancel'));
const NotFound = lazy(() => import('./components/common/NotFound'));

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
  useGlobalImageOptimization();
  return (
    <div className="bg-[#F3F3F3] overflow-x-hidden">
      <ScrollToTopOnRouteChange />
      <Header />
      <Suspense fallback={<Loader label="Loading page..." className="min-h-[60vh]" />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tyres" element={<Tyre />} />
          <Route path="/wheels" element={<Wheels />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/services" element={<Service />} />
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
      </Suspense>
      <Footer />
      <ToastContainer />
    </div>
  );
}

export default App;