import { NextRequest, NextResponse } from 'next/server';

// Backend API URL
const BACKEND_API_URL = 'http://localhost:5000/api';

export async function GET(request: NextRequest) {
    try {
        // Get query parameters
        const { searchParams } = new URL(request.url);
        const queryString = searchParams.toString();

        // Build the backend URL
        const backendUrl = `${BACKEND_API_URL}/provinces${queryString ? `?${queryString}` : ''}`;

        console.log(`[Proxy] Forwarding request to: ${backendUrl}`);

        // Forward the request to the backend
        const response = await fetch(backendUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            console.error(`[Proxy] Backend error: ${response.status} ${response.statusText}`);
            return NextResponse.json(
                { error: `Backend API error: ${response.statusText}` },
                { status: response.status }
            );
        }

        const data = await response.json();
        console.log(`[Proxy] Successfully fetched ${data.length || 0} provinces`);

        // Return the data with CORS headers
        return NextResponse.json(data, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
        });
    } catch (error) {
        console.error('[Proxy] Error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    });
}
