'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Simple map component to test Leaflet
const SimpleMap = () => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return <div>Initializing map...</div>;
    }

    return (
        <div style={{ height: '400px', width: '100%', backgroundColor: '#e0e0e0', border: '2px solid red' }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                fontSize: '18px',
                color: 'red'
            }}>
                Map Container - Leaflet should render here
            </div>
        </div>
    );
};

export default SimpleMap;