'use client';

import React from 'react';

export default function BasicTest() {
    return React.createElement('div', {
        style: {
            backgroundColor: 'yellow',
            color: 'black',
            padding: '20px',
            margin: '20px',
            border: '2px solid red'
        }
    }, 'BASIC TEST COMPONENT - If you see this, React works!');
}