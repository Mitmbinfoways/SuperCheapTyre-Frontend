'use client';
import { Suspense } from 'react';
import Tyre from '../../components/tyre/Tyre';
import Loader from '../../components/common/Loader';

export default function Page() {
    return (
        <Suspense fallback={<Loader label="Loading tyres..." />}>
            <Tyre />
        </Suspense>
    );
}
