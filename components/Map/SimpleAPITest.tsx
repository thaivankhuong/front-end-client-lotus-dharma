'use client';

import { useState, useEffect } from 'react';

export default function SimpleAPITest() {
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log('🔄 Testing API call to backend...');
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

                const response = await fetch('/api/provinces?IncludeGeometry=true', {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                    },
                    signal: controller.signal,
                });

                clearTimeout(timeoutId);

                console.log('📡 Response status:', response.status);

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                const result = await response.json();
                console.log('✅ API call successful, data:', result);

                setData(result);
                setLoading(false);
            } catch (err) {
                console.error('❌ API call failed:', err);
                setError(err instanceof Error ? err.message : 'Unknown error');
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div style={{backgroundColor: 'blue', color: 'white', padding: '20px', margin: '20px'}}>
                <h3>🔄 LOADING API DATA...</h3>
                <p>Testing connection to backend API at localhost:5000</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{backgroundColor: 'red', color: 'white', padding: '20px', margin: '20px'}}>
                <h3>❌ API ERROR</h3>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div style={{backgroundColor: 'green', color: 'white', padding: '20px', margin: '20px'}}>
            <h3>✅ API SUCCESS!</h3>
            <p>Loaded {Array.isArray(data) ? data.length : 'unknown'} provinces from backend</p>
            {data && Array.isArray(data) && data.length > 0 && (
                <div>
                    <h4>First few provinces:</h4>
                    <ul>
                        {data.slice(0, 3).map((province: any, index: number) => (
                            <li key={index}>
                                {province.name} ({province.provinceId})
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}