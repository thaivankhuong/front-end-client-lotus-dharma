'use client';

import { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/lib/config/env';

export default function DebugPanel() {
    const [logs, setLogs] = useState<string[]>([]);
    const [apiStatus, setApiStatus] = useState('Testing...');

    useEffect(() => {
        const testAPI = async () => {
            try {
                console.log('🔍 [DEBUG] Testing API connection...');
                setLogs(prev => [...prev, '🔍 Testing API connection...']);

                const response = await fetch(`${API_BASE_URL}/provinces?IncludeGeometry=true`);
                console.log('📡 [DEBUG] Response status:', response.status);
                setLogs(prev => [...prev, `📡 Response status: ${response.status}`]);

                if (response.ok) {
                    const data = await response.json();
                    const message = `✅ API OK: ${Array.isArray(data) ? data.length : 'unknown'} provinces`;
                    console.log('✅ [DEBUG]', message);
                    setLogs(prev => [...prev, message]);
                    setApiStatus(message);
                } else {
                    const message = `❌ HTTP Error: ${response.status}`;
                    console.log('❌ [DEBUG]', message);
                    setLogs(prev => [...prev, message]);
                    setApiStatus(message);
                }
            } catch (error) {
                const message = `❌ Network Error: ${error instanceof Error ? error.message : String(error)}`;
                console.log('❌ [DEBUG]', message);
                setLogs(prev => [...prev, message]);
                setApiStatus(message);
            }
        };

        testAPI();
    }, []);

    return (
        <div style={{
            position: 'fixed',
            top: '10px',
            right: '10px',
            backgroundColor: 'rgba(0,0,0,0.8)',
            color: 'white',
            padding: '10px',
            borderRadius: '5px',
            fontSize: '12px',
            maxWidth: '300px',
            zIndex: 9999
        }}>
            <h4>🐛 DEBUG PANEL</h4>
            <p><strong>API Status:</strong> {apiStatus}</p>
            <div style={{ maxHeight: '200px', overflow: 'auto', marginTop: '10px' }}>
                <strong>Logs:</strong>
                <ul style={{ margin: '5px 0', paddingLeft: '15px' }}>
                    {logs.map((log, index) => (
                        <li key={index} style={{ marginBottom: '2px' }}>{log}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}