'use client';
import { Suspense } from 'react';
import Wheels from '../../components/tyre/Wheels';
import Loader from '../../components/common/Loader';

export default function Page() {
    return (
        <Suspense fallback={<Loader label="Loading wheels..." />}>
            <Wheels />
        </Suspense>
    );
}
