const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const { commands, sandboxDir } = require('./scripts/commands');

const app = express();
const port = 5001;
const logFile = '/home/ask/ubuntu-scripts-tester/log.txt';

app.use(cors());
app.use(express.json());

app.post('/setup-environment', (req, res) => {
  const script = req.body.script;
  const command = commands[script];

  if (!command) {
    return res.status(400).json({ error: 'Invalid script name' });
  }

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error setting up environment: ${error.message}`);
      return res.status(500).json({ error: `Error setting up environment: ${stderr || error.message}` });
    }
    res.json({ output: stdout });
  });
});

app.post('/destroy-environment', (req, res) => {
  const command = `rm -rf ${sandboxDir} && echo "Environment destroyed"`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error destroying environment: ${error.message}`);
      return res.status(500).json({ error: `Error destroying environment: ${stderr || error.message}` });
    }
    res.json({ output: stdout });
  });
});

app.post('/run-script', (req, res) => {
  const script = req.body.script;
  const command = commands[script];

  if (!command) {
    return res.status(400).json({ error: 'Invalid script name' });
  }

  exec(command, { cwd: sandboxDir }, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error running script: ${error.message}`);
      return res.status(500).json({ error: `Error running script: ${stderr || error.message}` });
    }
    res.json({ output: stdout });
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
