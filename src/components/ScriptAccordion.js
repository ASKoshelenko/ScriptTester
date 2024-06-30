import React, { useState } from 'react';
import axios from 'axios';
import '../App.css';

const ScriptAccordion = ({ script, description, isOpen, onToggle }) => {
  const [isEnvironmentSetup, setIsEnvironmentSetup] = useState(false);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [command, setCommand] = useState('');

  const setupEnvironment = () => {
    axios.post('http://192.168.194.24:5001/setup-environment', { script })
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
    axios.post('http://192.168.194.24:5001/run-script', { script })
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
    axios.post('http://192.168.194.24:5001/destroy-environment', { script })
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

  const getCommand = () => {
    axios.get(`http://192.168.194.24:5001/get-command/${script}`)
      .then(response => {
        setCommand(response.data.command);
      })
      .catch(err => {
        const errorMsg = err.response && err.response.data ? err.response.data.error : 'Error getting command';
        setError(errorMsg);
      });
  };

  React.useEffect(() => {
    getCommand();
  }, [script]);

  return (
    <div className="script-accordion">
      <div className="script-header" onClick={onToggle}>
        <h3>{script}</h3>
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
