'use strict';

const express = require('express');
const { Server } = require('ws');

const PORT = process.env.PORT || 80;
const INDEX = '/index.html';

const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const wss = new Server({ server });

wss.on('connection', (ws) => {
  console.log('Client connected');
  wss.clients.forEach((client) => {
    client.send('hi!');
});
  ws.on('close', () => console.log('Client disconnected'));
  ws.on('message', function(message) {
    wss.clients.forEach((client) => {
        client.send('hi!');
    });
  });

});
