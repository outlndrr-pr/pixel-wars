import TestStyles from '../test-styles';

export default function TestPage() {
  return (
    <div>
      <div style={{ padding: '20px', backgroundColor: '#121212', color: 'white' }}>
        <h1>CSS Test Page</h1>
        <p>This page is designed to test if CSS styles are being applied correctly.</p>
        <p>If you can see this text in white on a dark background, the inline styles are working.</p>
        <p>The test components below should show if the global CSS styles are working.</p>
      </div>
      
      <TestStyles />
    </div>
  );
} 