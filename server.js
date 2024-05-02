const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
app.use(bodyParser.json());

const clients = {
  'client-id-1': {
    secret: 'client-secret-1',
    scope: ['read', 'write']
  },
  'client-id-2': {
    secret: 'client-secret-2',
    scope: ['read']
  }
};

const users = {
  'user-1': {
    password: 'password-1',
    scope: ['read', 'write']
  },
  'user-2': {
    password: 'password-2',
    scope: ['read']
  }
};

app.post('/token', (req, res) => {
  const { grant_type, client_id, client_secret, username, password } = req.body;

  if (grant_type === 'client_credentials') {
    if (!clients[client_id] || clients[client_id].secret!== client_secret) {
      return res.status(401).json({ error: 'invalid_client' });
    }
    const token = jwt.sign({ client_id, scope: clients[client_id].scope }, 'secret-key', { expiresIn: '1h' });
    return res.json({ access_token: token, token_type: 'Bearer', expires_in: 3600 });
  } else if (grant_type === 'password') {
    if (!users[username] || users[username].password!== password) {
      return res.status(401).json({ error: 'invalid_grant' });
    }
    const token = jwt.sign({ username, scope: users[username].scope }, 'secret-key', { expiresIn: '1h' });
    return res.json({ access_token: token, token_type: 'Bearer', expires_in: 3600 });
  } else {
    return res.status(400).json({ error: 'unsupported_grant_type' });
  }
});

app.listen(3000, () => {
  console.log('OAuth 2.0 server listening on port 3000');
});