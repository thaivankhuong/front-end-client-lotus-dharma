'use client';

import { useState, useEffect } from 'react';

export default function APITest() {
    const [status, setStatus] = useState('Testing...');

    useEffect(() => {
        const test = async () => {
            try {
                setStatus('Fetching...');
                const response = await fetch('http://localhost:5000/api/provinces?IncludeGeometry=true');
                if (response.ok) {
                    const data = await response.json();
                    setStatus(`SUCCESS: ${Array.isArray(data) ? data.length : '?'} items`);
                } else {
                    setStatus(`HTTP ${response.status}`);
                }
            } catch (error) {
                setStatus(`ERROR: ${error.message}`);
            }
        };

        test();
    }, []);

    return (
        <div style={{
            backgroundColor: 'yellow',
            color: 'black',
            padding: '10px',
            margin: '10px',
            border: '2px solid red'
        }}>
            <strong>API TEST:</strong> {status}
        </div>
    );
}