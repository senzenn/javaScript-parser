import React from 'react';
import './Header.css';

function Header({ onRun }) {
  const handleNewFile = () => {
    if (window.confirm('Create a new file? Any unsaved changes will be lost.')) {
      window.location.reload();
    }
  };

  return (
    <header className="header">
      <h1>Mini JavaScript Engine</h1>
      <div className="toolbar">
        <button className="btn" onClick={handleNewFile}>New</button>
        <button 
          className="btn btn-primary" 
          onClick={onRun}>
          Run
        </button>
      </div>
    </header>
  );
}

export default Header; 