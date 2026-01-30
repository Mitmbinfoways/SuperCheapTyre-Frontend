import Link from 'next/link';
import { images } from '../assets/data';
import { Mail } from 'lucide-react';
import { FaFacebookF } from "react-icons/fa";
import { ImInstagram } from "react-icons/im";
import { useState } from 'react';
import { useEffect } from 'react';
import { getContactInfoDetail } from '../axios/axios';
import { formatPhoneNumber } from '../Utils/FormatePhoneNumber';

const Footer = () => {
    const [contactData, setContactData] = useState(null);

    const fetchContactInfo = async () => {
        try {
            const response = await getContactInfoDetail();
            setContactData(response.data.data);
        } catch (error) {
            console.error("Error fetching contact info:", error);
        }
    };
    useEffect(() => {
        fetchContactInfo();
    }, []);

    return (
        <footer className="relative z-50 bg-[#000000] text-white pt-12 sm:pt-16 md:pt-20]">
            <div className="max-w-screen-2xl mx-auto px-3 sm:px-4 lg:px-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 md:gap-0 mb-8 sm:mb-10 md:mb-4">
                    {/* Logo and Social */}
                    <div className="space-y-4 sm:space-y-6 text-center sm:text-left">
                        <img src={images.logo} alt="Supercheap Tyres Logo" className="w-48 sm:w-56 md:w-60 h-auto mx-auto sm:mx-0" />
                        <p className="font-plus-jakarta text-white text-sm sm:text-base  mx-auto sm:mx-0">
                            Supercheap Tyres Melbourne’s affordable tyre experts.
                            Our mission is to provide convenience, safety and value for every customer on every road in Australia.
                        </p>
                        <div className="flex space-x-3 sm:space-x-4 justify-center sm:justify-start">
                            <a href="https://www.facebook.com/Supercheaptyre" className="p-2 bg-white rounded-full"><FaFacebookF size={18} className="sm:w-5 sm:h-5 text-black" /></a>
                            {/* <a href="#" className="p-2 bg-white rounded-full"><FaTwitter size={18} className="sm:w-5 sm:h-5 text-black" /></a> */}
                            <a href="https://www.instagram.com/supercheaptyres/" className="p-2 bg-white rounded-full"><ImInstagram size={18} className="sm:w-5 sm:h-5 text-black rounded-sm" /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-3 sm:space-y-4 text-center sm:text-left sm:space-x-32">
                        <h4 className="text-lg sm:text-xl font-semibold font-plus-jakarta mb-3 sm:mb-4 sm:mx-32 text-nowrap">Quick Links</h4>
                        <ul className="space-y-2 sm:space-y-6 font-plus-jakarta text-white text-sm sm:text-base">
                            <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
                            <li><Link href="/tyres" className="hover:text-primary transition-colors">Tyres</Link></li>
                            <li><Link href="/wheels" className="hover:text-primary transition-colors">Wheels</Link></li>
                            <li><Link href="/appointment" className="hover:text-primary transition-colors">Book Appointment</Link></li>
                            <li><Link href="/services" className="hover:text-primary transition-colors">Services</Link></li>
                            <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
                            <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                            <li><Link href="/contactus" className="hover:text-primary transition-colors">Contact Us</Link></li>
                        </ul>
                    </div>

                    {/* Contact + We Accept (stacked) */}
                    <div className="space-y-6 sm:space-y-8 text-center sm:text-left">
                        <div className="space-y-3 sm:space-y-4">
                            <h4 className="text-lg sm:text-xl font-semibold font-plus-jakarta mb-3 sm:mb-4">Contact Us</h4>
                            <ul className="space-y-2 sm:space-y-3 font-plus-jakarta text-white text-sm sm:text-base">
                                <li className="flex items-center space-x-2 sm:space-x-3 justify-center sm:justify-start">
                                    <img src='/contactus/call.svg' size={16} className="w-5 h-5 sm:w-5 sm:h-5 text-white" />
                                    <a href={`tel:${contactData?.phone || "(03)97936190"}`}>
                                        {formatPhoneNumber(contactData?.phone) || "(03)97936190"}
                                    </a>
                                </li>
                                <li className="flex items-center space-x-2 sm:space-x-3 justify-center sm:justify-start">
                                    <Mail size={16} className="sm:w-5 sm:h-5" />
                                    <a
                                        href={`mailto:${contactData?.email || "supercheaptyredandenong@gmail.com"}`}
                                    >
                                        {contactData?.email || "supercheaptyredandenong@gmail.com"}
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className="border border-white rounded-xl sm:rounded-2xl p-3 sm:p-4 sm:w-[280px]">
                            <h4 className="text-lg sm:text-xl font-semibold font-lexend mb-3 sm:mb-4 ps-5">WE ACCEPT</h4>
                            <div className="grid grid-cols-3 gap-2 sm:gap-3 md:ps-5 lg:ps-5 ps-10">
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
                    {/* <div className="flex gap-2 items-center">
                        <p className="font-plus-jakarta text-white text-sm sm:text-base">Designed and Developed by</p>
                        <a href="https://mavixtech.com/" target="_blank" rel="noopener noreferrer">
                            <img src="/logo.svg" alt="Mavix Tech" className="h-4 w-auto hover:opacity-80 transition-opacity" />
                        </a>
                    </div> */}
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6 font-plus-jakarta text-gray-400 text-sm sm:text-base">
                        <Link href="/privacy" className="text-white transition-colors">Privacy & Policy</Link>
                        <Link href="/terms" className="text-white transition-colors">Terms & Condition</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
