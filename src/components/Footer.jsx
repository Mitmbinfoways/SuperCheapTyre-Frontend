import React from 'react';
import { Link } from 'react-router-dom';
import { images } from '../assets/data';
import { Facebook, Twitter, Instagram, Phone, Mail } from 'lucide-react';
import { LiaPhoneVolumeSolid } from "react-icons/lia";
import { FaFacebookF, FaTwitter } from "react-icons/fa";
import { ImInstagram } from "react-icons/im";
const Footer = () => {
    return (
        <footer className="relative z-50 bg-[#000000] text-white pt-12 sm:pt-16 md:pt-20]">
            <div className="max-w-screen-2xl mx-auto px-3 sm:px-4 lg:px-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 md:gap-12 mb-8 sm:mb-10 md:mb-4">
                    {/* Logo and Social */}
                    <div className="space-y-4 sm:space-y-6 text-center sm:text-left">
                        <img src={images.logo} alt="Supercheap Tyres Logo" className="w-48 sm:w-56 md:w-60 h-auto mx-auto sm:mx-0" />
                        <p className="font-plus-jakarta text-white text-sm sm:text-base max-w-72 mx-auto sm:mx-0">
                            Our vision is to provide convenience and help increase your sales business.
                        </p>
                        <div className="flex space-x-3 sm:space-x-4 justify-center sm:justify-start">
                            <a href="https://www.facebook.com/Supercheaptyre" className="p-2 bg-white rounded-full"><FaFacebookF size={18} className="sm:w-5 sm:h-5 text-black" /></a>
                            <a href="#" className="p-2 bg-white rounded-full"><FaTwitter size={18} className="sm:w-5 sm:h-5 text-black" /></a>
                            <a href="https://www.instagram.com/supercheaptyres/" className="p-2 bg-white rounded-full"><ImInstagram size={18} className="sm:w-5 sm:h-5 text-black rounded-sm" /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-3 sm:space-y-4 text-center sm:text-left sm:space-x-32">
                        <h4 className="text-lg sm:text-xl font-semibold font-plus-jakarta mb-3 sm:mb-4 sm:mx-32">Quick Links</h4>
                        <ul className="space-y-2 sm:space-y-6 font-plus-jakarta text-white text-sm sm:text-base">
                            <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
                            <li><Link to="/tyres" className="hover:text-primary transition-colors">Tyres</Link></li>
                            <li><Link to="/appointment" className="hover:text-primary transition-colors">Book Appointment</Link></li>
                            {/* <li><Link to="#" className="hover:text-primary transition-colors">Services</Link></li> */}
                            {/* <li><Link to="#" className="hover:text-primary transition-colors">My Invoice</Link></li> */}   
                            <li><Link to="/blog" className="hover:text-primary transition-colors">Blog</Link></li>                         
                            <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                            <li><Link to="/contactus" className="hover:text-primary transition-colors">Contact Us</Link></li>
                        </ul>
                    </div>

                    {/* Contact + We Accept (stacked) */}
                    <div className="space-y-6 sm:space-y-8 text-center sm:text-left">
                        <div className="space-y-3 sm:space-y-4">
                            <h4 className="text-lg sm:text-xl font-semibold font-plus-jakarta mb-3 sm:mb-4">Contact Us</h4>
                            <ul className="space-y-2 sm:space-y-3 font-plus-jakarta text-white text-sm sm:text-base">
                                <li className="flex items-center space-x-2 sm:space-x-3 justify-center sm:justify-start">
                                    <img src='/contactus/call.svg' size={16} className="w-5 h-5 sm:w-5 sm:h-5 text-white" />
                                    <a href="tel:1234567453">
                                        1234567453
                                    </a>
                                </li>
                                <li className="flex items-center space-x-2 sm:space-x-3 justify-center sm:justify-start">
                                    <Mail size={16} className="sm:w-5 sm:h-5" />
                                    <a
                                        href="mailto:supercheaptyredandenong@gmail.com"
                                    >
                                        supercheaptyredandenong@gmail.com
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className="border border-white rounded-xl sm:rounded-2xl p-3 sm:p-4 sm:w-[280px]">
                            <h4 className="text-lg sm:text-xl font-semibold font-lexend mb-3 sm:mb-4 ps-5">WE ACCEPT</h4>
                            <div className="grid grid-cols-3 gap-2 sm:gap-3 ps-5">
                                {Object.values(images.payment).map((src, i) => (
                                    <div key={i} className="bg-white rounded-md flex items-center justify-center w-14 h-10">
                                        <img src={src} alt="Payment method" className="max-h-full max-w-full object-contain rounded-lg" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white py-4 sm:py-6 flex flex-col sm:flex-row justify-between items-center text-center sm:text-left space-y-3 sm:space-y-0">
                    <p className="font-plus-jakarta text-white text-sm sm:text-base">©2025 Copyright SupercheapTyre Dandenong</p>
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6 font-plus-jakarta text-gray-400 text-sm sm:text-base">
                        <Link to="/privacy" className="text-white transition-colors">Privacy & Policy</Link>
                        <Link to="/terms" className="text-white transition-colors">Terms & Condition</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
