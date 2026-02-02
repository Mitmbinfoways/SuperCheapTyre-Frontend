'use client';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchContactInfo } from '../store/slices/contactSlice';
import Header from './Header';
import Footer from './Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CheckPendingOrder from './CheckPendingOrder';
import useGlobalImageOptimization from '../hooks/useGlobalImageOptimization';

export default function ClientLayout({ children }) {
    useGlobalImageOptimization();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchContactInfo());
    }, [dispatch]);

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
