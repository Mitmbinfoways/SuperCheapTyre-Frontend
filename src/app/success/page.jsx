'use client';
import { Suspense } from 'react';
import Success from '../../components/Appointment/Success';
import Loader from '../../components/common/Loader';

export default function Page() {
    return (
        <Suspense fallback={<Loader label="Processing order..." />}>
            <Success />
        </Suspense>
    );
}
