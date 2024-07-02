const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { exec } = require('child_process');
const { commands, setupCommands, destroyCommands, sandboxDir } = require('./scripts/commands');
const logger = require('./utils/logger');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/setup-environment', (req, res) => {
  const { script } = req.body;
  const setupCommand = setupCommands[script];

  if (!setupCommand) {
    logger.error(`Setup command for ${script} not found`);
    return res.status(400).json({ error: `Setup command for ${script} not found` });
  }

  exec(setupCommand, (err, stdout, stderr) => {
    if (err) {
      logger.error(`Error setting up environment for ${script}: ${stderr}`);
      return res.status(500).json({ error: stderr });
    }

    logger.info(`Environment setup for ${script} completed: ${stdout}`);
    res.json({ output: stdout });
  });
});

app.post('/run-script', (req, res) => {
  const { script } = req.body;
  const command = commands[script];

  if (!command) {
    logger.error(`Invalid script: ${script}`);
    return res.status(400).json({ error: 'Invalid script' });
  }

  exec(command, (err, stdout, stderr) => {
    if (err) {
      logger.error(`Error running script ${script}: ${stderr}`);
      return res.status(500).json({ error: stderr });
    }

    logger.info(`Script ${script} executed successfully: ${stdout}`);
    res.json({ output: stdout });
  });
});

app.post('/destroy-environment', (req, res) => {
  const { script } = req.body;
  const destroyCommand = destroyCommands[script];

  if (!destroyCommand) {
    logger.error(`Destroy command for ${script} not found`);
    return res.status(400).json({ error: `Destroy command for ${script} not found` });
  }

  exec(destroyCommand, (err, stdout, stderr) => {
    if (err) {
      logger.error(`Error destroying environment for ${script}: ${stderr}`);
      return res.status(500).json({ error: stderr });
    }

    logger.info(`Environment destroyed for ${script}: ${stdout}`);
    res.json({ output: 'Environment destroyed' });
  });
});

app.get('/get-command/:script', (req, res) => {
  const { script } = req.params;
  const command = commands[script];

  if (!command) {
    logger.error(`Command not found: ${script}`);
    return res.status(404).json({ error: 'Command not found' });
  }

  logger.info(`Command retrieved for ${script}: ${command}`);
  res.json({ command });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
