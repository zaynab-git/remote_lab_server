// 'use strict';

// const express = require('express');
// const { Server } = require('ws');

// const PORT = 8080;
// const INDEX = '/index.html';

// const server = express()
//   .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
//   .listen(PORT, () => console.log(`Listening on ${PORT}`));

// const wss = new Server({ server });

// wss.on('connection', (ws) => {
//   console.log('Client connected');
//   wss.clients.forEach((client) => {
//     client.send('hi!');
// });
//   ws.on('close', () => console.log('Client disconnected'));
//   ws.on('message', function(message) {
//     wss.clients.forEach((client) => {
//         client.send('hi!');
//     });
//   });

// });







const express = require('express');
const WebSocket = require('ws');
const PORT = process.env.PORT || 8080;


const path = require('path');
const server = express()
    .use(express.static(path.join(__dirname, '../flexdash-main/dist')))
    .listen(PORT, () => {
        console.log(`Server listening on port ${PORT}!`)
    });


var modbus = require("modbus-stream");
const wss = new WebSocket.Server({ server });




modbus.tcp.connect(502, "127.0.0.1", (err, connection) => {

    function myLoop() {         
      setTimeout(function() {   
        connection.readCoils({ address: 1, quantity: 1, extra: { unitId: 1 } }, (err, res) => {
            console.log(res.response.data[0])
        });                     
          myLoop();             
      }, 1000)
    }
    
    myLoop();   

    wss.on('connection', async (ws) => {
        
        console.log('Client connected');
        ws.on('close', () => console.log('Client disconnected'));
        
        ws.on('message', function(message) {
            let m
            try {
            m = JSON.parse(message)
            } catch (e) {
            console.log(e)
            return
            }
            if (typeof m !== 'object' || typeof m.topic !== 'string' || m.payload === undefined) {
            console.log("message is missing topic and/or payload")
            return
            }

            
            connection.writeSingleCoil({ address: parseInt(m.topic), value: 1 }, (err, info) => {
                console.log("response", info.response);
                });
        });
    });


});
