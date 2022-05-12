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
        const [client] = wss.clients      
        setTimeout(function() {   
          connection.readCoils({ address: 0, quantity: 8, extra: { unitId: 1 } }, (err, res) => {
              res.response.data.forEach((value, index) => {
                client.send(JSON.stringify({topic: index.toString(), payload: value}));
              });
          });                     
            myLoop();             
        }, 1000)
      }

    wss.on('connection', (ws) => {

        console.log('Client connected');

        myLoop();   

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
            ws.send(message)
            connection.writeSingleCoil({ address: parseInt(m.topic), value: m.payload}, (err, info) => {
                console.log("response", info.response);
                });
        });


    });


});
