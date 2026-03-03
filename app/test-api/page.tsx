export default function TestAPIPage() {
  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>🔬 API Test Page</h1>
      <p>Open browser console and check for API call logs</p>

      <div style={{ marginTop: '20px' }}>
        <iframe
          src="/debug"
          style={{
            width: '100%',
            height: '600px',
            border: '2px solid #ccc',
            borderRadius: '8px'
          }}
          title="Debug Page"
        />
      </div>
    </div>
  );
}