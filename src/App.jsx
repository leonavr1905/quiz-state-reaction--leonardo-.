import React from 'react';
import TodoApp from './TodoApp';

function App() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      width: '100vw',
      // Menggunakan gradasi gelap agar kotak hitam lebih kontras
      background: 'radial-gradient(circle, #2c2c2c 0%, #121212 100%)', 
      margin: 0,
      padding: 0,
      overflow: 'hidden'
    }}>
      <TodoApp />
    </div>
  );
}

export default App;