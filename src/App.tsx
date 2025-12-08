import React from 'react';
import ClientThemeProvider from './components/ClientThemeProvider';
import './App.css';
import ULBSelectionDemo from './components/ULBSelectionDemo';

function App() {
  return (
    <ClientThemeProvider>
      <ULBSelectionDemo />
    </ClientThemeProvider>
  );
}

export default App
