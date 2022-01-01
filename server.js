'use strict';

const express = require('express');
const { Server } = require('ws');

const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';

const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const wss = new Server({ server });

wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.on('close', () => console.log('Client disconnected'));
});

setInterval(() => {
  wss.clients.forEach((client) => {
    client.send(new Date().toTimeString());
  });
}, 1000);



// {
//   "name": "server",
//   "version": "1.0.0",
//   "description": "remote lab project server",
//   "main": "server.js",
//   "scripts": {
//     "start": "node server.js"
//   },
//   "engines": {
//     "node": "12.17.x"
//   },
//   "repository": {
//     "type": "git",
//     "url": ""
//   },
//   "author": "zeynab heydarzadeh",
//   "license": "ISC",
//   "bugs": {
//     "url": ""
//   },
//   "homepage": "",
//   "dependencies": {
//     "express": "^4.17.2"
//   }
// }




// var wss = new (require('ws')).Server({port: (process.env.PORT || 8080)});
// console.log('listening on port: ' + 8080);

// wss.on('connection', function connection(ws, req) {
    
// 	ws.on('message', function(message) {

//         var msg = JSON.parse(message);
//         if ('topic' in msg && 'payload' in msg) {
//             if (msg.topic == 'exe') {
//                 console.log('exe')
//             }
//             else if (msg.topic == 'bit') {
//                 console.log('bit')
//             }
//             else {
//                 ws.send(JSON.stringify(msg));
//                 console.log(msg);
//             }
//         }
//         else {
//             console.log('missing topic or payload')
//         }
        
// 	});

// 	console.log('new client connected!');

// });