'use client';
import { Suspense } from 'react';
import BlogList from '../../components/Blog/BlogList';
import Loader from '../../components/common/Loader';

export default function Page() {
    return (
        <Suspense fallback={<Loader label="Loading blogs..." />}>
            <BlogList />
        </Suspense>
    );
}
