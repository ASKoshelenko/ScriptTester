import React from 'react';

const ScriptList = ({ scripts, onSelect }) => {
  return (
    <div>
      <h2>Scripts List</h2>
      <ul>
        {scripts.map((script, index) => (
          <li key={index} onClick={() => onSelect(script)}>
            {script}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ScriptList;