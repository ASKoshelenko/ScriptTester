import React from 'react';

const ScriptDetail = ({ script }) => {
  return (
    <div>
      <h2>Script Detail</h2>
      <pre>{script}</pre>
    </div>
  );
};

export default ScriptDetail;