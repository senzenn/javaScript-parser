import React from 'react';
import './OutputPanel.css';

function OutputPanel({ results, activeTab, onTabChange }) {
  return (
    <div className="output-container">
      <div className="tabs">
        <button 
          className={`tab-btn ${activeTab === 'output' ? 'active' : ''}`}
          onClick={() => onTabChange('output')}>
          Output
        </button>
        <button 
          className={`tab-btn ${activeTab === 'tokens' ? 'active' : ''}`}
          onClick={() => onTabChange('tokens')}>
          Tokens
        </button>
        <button 
          className={`tab-btn ${activeTab === 'ast' ? 'active' : ''}`}
          onClick={() => onTabChange('ast')}>
          AST
        </button>
        <button 
          className={`tab-btn ${activeTab === 'environment' ? 'active' : ''}`}
          onClick={() => onTabChange('environment')}>
          Environment
        </button>
      </div>
      
      <div className="tab-content">
        <div className={`tab-pane ${activeTab === 'output' ? 'active' : ''}`}>
          <pre className={results.error ? 'error-text' : ''}>
            {results.error ? `Error: ${results.error}` : results.output}
          </pre>
        </div>
        <div className={`tab-pane ${activeTab === 'tokens' ? 'active' : ''}`}>
          <pre>
            {results.tokens}
          </pre>
        </div>
        <div className={`tab-pane ${activeTab === 'ast' ? 'active' : ''}`}>
          <pre>
            {results.ast}
          </pre>
        </div>
        <div className={`tab-pane ${activeTab === 'environment' ? 'active' : ''}`}>
          <pre>
            {results.environment}
          </pre>
        </div>
      </div>
    </div>
  );
}

export default OutputPanel; 