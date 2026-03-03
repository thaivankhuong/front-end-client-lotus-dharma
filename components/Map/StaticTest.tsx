import React from 'react';

export default function StaticTest() {
    return (
        <div style={{
            backgroundColor: 'yellow',
            color: 'black',
            padding: '20px',
            margin: '10px',
            border: '3px solid orange',
            fontSize: '16px'
        }}>
            <h4>STATIC TEST COMPONENT</h4>
            <p>If you can see this, React rendering works!</p>
            <p>Time: {new Date().toLocaleTimeString()}</p>
        </div>
    );
}