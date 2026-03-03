'use client';

import { useState, useEffect } from 'react';

export default function DebugPage() {
    const [status, setStatus] = useState('Page loaded - JavaScript is working!');
    const [apiResult, setApiResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [timestamp, setTimestamp] = useState(Date.now());
    const [syncTest, setSyncTest] = useState('Sync test: ' + Math.random());

    // Log immediately on component mount
    console.log('🔧 Debug page component mounted successfully');

    useEffect(() => {
        const testAPI = async () => {
            try {
                setStatus('Testing API call to localhost:5000...');
                console.log('🚀 Starting API test...');

                const response = await fetch('http://localhost:5000/api/provinces?IncludeGeometry=true', {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                    },
                });

                console.log('📡 Response received, status:', response.status);

                if (response.ok) {
                    const data = await response.json();
                    console.log('✅ Data received:', data);
                    setApiResult(data);
                    setStatus(`✅ SUCCESS: Loaded ${Array.isArray(data) ? data.length : 'unknown'} provinces`);
                } else {
                    const errorText = await response.text();
                    console.log('❌ HTTP Error:', response.status, errorText);
                    setError(`HTTP ${response.status}: ${errorText}`);
                    setStatus(`❌ HTTP Error: ${response.status}`);
                }
            } catch (err) {
                console.error('❌ Network Error:', err);
                setError(err instanceof Error ? err.message : 'Unknown error');
                setStatus(`❌ Network Error: ${err instanceof Error ? err.message : 'Unknown'}`);
            }
        };

        // Test after component mounts
        setTimeout(testAPI, 1000);
    }, []);

    const handleTestAPI = async () => {
        try {
            setStatus('Testing API call...');
            console.log('🚀 Manual API test triggered...');

            const response = await fetch('http://localhost:5000/api/provinces?IncludeGeometry=true', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
            });

            console.log('📡 Response status:', response.status);

            if (response.ok) {
                const data = await response.json();
                console.log('✅ Data received:', data);
                setApiResult(data);
                setStatus(`✅ SUCCESS: Loaded ${Array.isArray(data) ? data.length : 'unknown'} provinces`);
            } else {
                const errorText = await response.text();
                console.log('❌ HTTP Error:', response.status, errorText);
                setError(`HTTP ${response.status}: ${errorText}`);
                setStatus(`❌ HTTP Error: ${response.status}`);
            }
        } catch (err) {
            console.error('❌ Network Error:', err);
            setError(err instanceof Error ? err.message : 'Unknown error');
            setStatus(`❌ Network Error: ${err instanceof Error ? err.message : 'Unknown'}`);
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'monospace' }}>
            <h1>🔧 API Debug Page</h1>
            <h2>Status: {status}</h2>
            <p>Timestamp: {timestamp}</p>
            <p>{syncTest}</p>
            <button
                onClick={handleTestAPI}
                style={{
                    padding: '10px 20px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    margin: '10px 5px'
                }}
            >
                Test API Now
            </button>
            <button
                onClick={() => {
                    setSyncTest('Sync test updated: ' + Math.random());
                    setTimestamp(Date.now());
                }}
                style={{
                    padding: '10px 20px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    margin: '10px 5px'
                }}
            >
                Test Sync Update
            </button>

            {error && (
                <div style={{ backgroundColor: '#ffe6e6', padding: '10px', margin: '10px 0', border: '1px solid red' }}>
                    <strong>Error:</strong> {error}
                </div>
            )}

            {apiResult && (
                <div style={{ backgroundColor: '#e6ffe6', padding: '10px', margin: '10px 0', border: '1px solid green' }}>
                    <strong>Success! Data received:</strong>
                    <pre style={{ maxHeight: '200px', overflow: 'auto', fontSize: '12px' }}>
                        {JSON.stringify(apiResult.slice(0, 2), null, 2)}
                    </pre>
                    <p>Total items: {Array.isArray(apiResult) ? apiResult.length : 'N/A'}</p>
                </div>
            )}

            <div style={{ marginTop: '20px' }}>
                <p><strong>Testing URL:</strong> http://localhost:5000/api/provinces?IncludeGeometry=true</p>
                <p><strong>Check browser console for detailed logs</strong></p>
            </div>
        </div>
    );
}