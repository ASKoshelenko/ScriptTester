import React, { useState } from 'react';
import axios from 'axios';

const ScriptRunner = ({ script }) => {
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const runScript = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:5001/run-script', { script });
      setOutput(response.data.output);
      setError('');
    } catch (err) {
      setOutput('');
      setError(err.response ? err.response.data.error : 'Error running script');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Run Script</h2>
      <button onClick={runScript} disabled={isLoading}>Run</button>
      {isLoading && <p>Running script...</p>}
      {output && (
        <div>
          <h3>Output</h3>
          <pre>{output}</pre>
        </div>
      )}
      {error && (
        <div>
          <h3>Error</h3>
          <pre style={{ color: 'red' }}>{error}</pre>
        </div>
      )}
    </div>
  );
};

export default ScriptRunner;