'use client';

import { useState, useEffect } from 'react';

export default function CORSTest() {
    const [status, setStatus] = useState('Testing CORS...');

    useEffect(() => {
        const testCORS = async () => {
            try {
                setStatus('Making CORS request...');
                const response = await fetch('http://localhost:5000/api/provinces?IncludeGeometry=true', {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                    },
                    mode: 'cors', // Explicitly set CORS mode
                });

                if (response.ok) {
                    const data = await response.json();
                    setStatus(`SUCCESS: ${Array.isArray(data) ? data.length : '?'} items loaded`);
                } else {
                    setStatus(`HTTP Error: ${response.status} ${response.statusText}`);
                }
            } catch (error) {
                setStatus(`CORS Error: ${error.message}`);
                console.error('CORS Test Error:', error);
            }
        };

        // Delay test to ensure component is mounted
        setTimeout(testCORS, 1000);
    }, []);

    return (
        <div style={{
            backgroundColor: 'red',
            color: 'white',
            padding: '10px',
            margin: '10px',
            border: '2px solid darkred'
        }}>
            <strong>CORS TEST:</strong> {status}
        </div>
    );
}