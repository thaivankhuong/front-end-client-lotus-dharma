'use client';

import React, { useState, useEffect } from 'react';

export default function TestAPI() {
    const [status, setStatus] = useState('Loading...');
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const testAPI = async () => {
            try {
                setStatus('Testing timeout...');

                // Simple timeout test
                await new Promise(resolve => setTimeout(resolve, 2000));

                setData({ test: 'data', count: 42 });
                setStatus('✅ Success! Timeout test completed');
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
                setStatus('❌ Error');
                console.error('API Test Error:', err);
            }
        };

        testAPI();
    }, []);

    return (
        <div style={{
            backgroundColor: '#f0f8ff',
            padding: '20px',
            margin: '20px',
            border: '2px solid #0066cc',
            borderRadius: '8px'
        }}>
            <h3 style={{ color: '#0066cc', marginBottom: '10px' }}>API Test Component</h3>
            <p><strong>Status:</strong> {status}</p>
            {error && <p style={{ color: 'red' }}><strong>Error:</strong> {error}</p>}
            {data && (
                <div>
                    <p><strong>Data sample:</strong></p>
                    <pre style={{
                        backgroundColor: '#f5f5f5',
                        padding: '10px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        maxHeight: '200px',
                        overflow: 'auto'
                    }}>
                        {JSON.stringify(data.slice(0, 2), null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
}