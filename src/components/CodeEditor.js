import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import './CodeEditor.css';

function CodeEditor({ code, onChange }) {
  return (
    <div className="editor-container">
      <div className="editor-label">Code Editor</div>
      <div className="editor-wrapper">
        <CodeMirror
          value={code}
          height="100%"
          theme="light"
          extensions={[javascript({ jsx: false })]}
          onChange={onChange}
          className="code-mirror-wrapper"
        />
      </div>
    </div>
  );
}

export default CodeEditor; 