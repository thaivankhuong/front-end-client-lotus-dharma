'use client';

import React, { useState, useEffect } from 'react';

export default function TextOnlyMap() {
    const [provinces, setProvinces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/provinces?IncludeGeometry=true');
                if (!response.ok) {
                    throw new Error('Failed to fetch provinces');
                }
                const data = await response.json();
                setProvinces(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div>Loading provinces...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div style={{backgroundColor: 'lightblue', padding: '20px', margin: '20px'}}>
            <h3>Text-Only Map Component</h3>
            <p>Loaded {provinces.length} provinces:</p>
            <ul>
                {provinces.slice(0, 5).map((province, index) => (
                    <li key={index}>
                        {province.name} ({province.provinceId})
                    </li>
                ))}
            </ul>
        </div>
    );
}