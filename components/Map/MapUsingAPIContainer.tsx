'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamic import to avoid SSR issues
const LeafletMapAPI = dynamic(() => import('./LeafletMapAPI'), {
    ssr: false,
    loading: () => (
        <div className="h-screen w-full flex items-center justify-center bg-gray-100">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Đang tải bản đồ từ API...</p>
            </div>
        </div>
    ),
});

export default function MapUsingAPIContainer() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return <LeafletMapAPI />;
}
