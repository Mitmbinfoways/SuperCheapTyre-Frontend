'use client';
import Header from './Header';
import Footer from './Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CheckPendingOrder from './CheckPendingOrder';
import useGlobalImageOptimization from '../hooks/useGlobalImageOptimization';

export default function ClientLayout({ children }) {
    useGlobalImageOptimization();

    return (
        <>
            <CheckPendingOrder />
            <Header />
            <main className="min-h-screen">
                {children}
            </main>
            <Footer />
            <ToastContainer />
        </>
    );
}
