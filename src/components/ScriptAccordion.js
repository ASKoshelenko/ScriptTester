import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';
import config from '../config';

const ScriptAccordion = ({ script, description, command, isOpen, onToggle }) => {
  const [isEnvironmentSetup, setIsEnvironmentSetup] = useState(false);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const setupEnvironment = () => {
    axios.post(`${config.serverUrl}/setup-environment`, { script })
      .then(response => {
        setIsEnvironmentSetup(true);
        setOutput(response.data.output);
        setError('');
      })
      .catch(err => {
        const errorMsg = err.response && err.response.data ? err.response.data.error : 'Error setting up environment';
        setError(errorMsg);
      });
  };

  const runScript = () => {
    axios.post(`${config.serverUrl}/run-script`, { script })
      .then(response => {
        setOutput(response.data.output);
        setError('');
      })
      .catch(err => {
        const errorMsg = err.response && err.response.data ? err.response.data.error : 'Error running script';
        setError(errorMsg);
      });
  };

  const destroyEnvironment = () => {
    axios.post(`${config.serverUrl}/destroy-environment`, { script })
      .then(response => {
        setIsEnvironmentSetup(false);
        setOutput(response.data.output);
        setError('');
      })
      .catch(err => {
        const errorMsg = err.response && err.response.data ? err.response.data.error : 'Error destroying environment';
        setError(errorMsg);
      });
  };

  return (
    <div className="script-accordion">
      <div className="script-header" onClick={onToggle}>
        <h3>{description}</h3>
      </div>
      {isOpen && (
        <div className="script-content">
          <p>{description}</p>
          <div className="command-section">
            <strong>Command:</strong> {command}
          </div>
          <button
            className={`setup-button ${isEnvironmentSetup ? 'destroy-button' : ''}`}
            onClick={isEnvironmentSetup ? destroyEnvironment : setupEnvironment}
          >
            {isEnvironmentSetup ? 'Destroy Environment' : 'Setup Environment'}
          </button>
          {isEnvironmentSetup && (
            <button className="run-button" onClick={runScript}>
              Run Script
            </button>
          )}
          <div className="output-section">
            <h4>Output</h4>
            <pre>{output}</pre>
            {error && (
              <div className="error-section">
                <h4>Error</h4>
                <pre>{error}</pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScriptAccordion;
