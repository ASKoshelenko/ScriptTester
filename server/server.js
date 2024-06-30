const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { exec } = require('child_process');
const { commands, setupCommands, sandboxDir } = require('./scripts/commands');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/setup-environment', (req, res) => {
  const { script } = req.body;
  const setupCommand = setupCommands[script];

  if (!setupCommand) {
    return res.status(400).json({ error: 'Invalid script' });
  }

  exec(setupCommand, (err, stdout, stderr) => {
    if (err) {
      return res.status(500).json({ error: stderr });
    }

    res.json({ output: stdout });
  });
});

app.post('/run-script', (req, res) => {
  const { script } = req.body;
  const command = commands[script];

  if (!command) {
    return res.status(400).json({ error: 'Invalid script' });
  }

  exec(command, (err, stdout, stderr) => {
    if (err) {
      return res.status(500).json({ error: stderr });
    }

    res.json({ output: stdout });
  });
});

app.post('/destroy-environment', (req, res) => {
  exec(`sudo rm -rf ${sandboxDir}`, (err, stdout, stderr) => {
    if (err) {
      return res.status(500).json({ error: stderr });
    }

    res.json({ output: 'Environment destroyed' });
  });
});

app.get('/get-command/:script', (req, res) => {
  const { script } = req.params;
  const command = commands[script];

  if (!command) {
    return res.status(404).json({ error: 'Command not found' });
  }

  res.json({ command });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
