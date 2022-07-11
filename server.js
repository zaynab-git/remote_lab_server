const express = require('express');
const WebSocket = require('ws');
const PORT = process.env.PORT || 8080;


const path = require('path');
const server = express()
    .use(express.static(path.join(__dirname, '../flexdash/dist')))
    .listen(PORT, () => {
        console.log(`Server listening on port ${PORT}!`)
    });


var coils = [0,0,0,0,0,0,0,0]
var discrete = [0,0,0,0,0,0,0,0]

const ModbusRTU = require("modbus-serial");
const client = new ModbusRTU();
client.connectRTUBuffered("/dev/ttyACM0", { baudRate: 115200 }) ;
client.setID(1);

const wss = new WebSocket.Server({ server });

    wss.on('connection', (ws) => {

      setInterval(function() {

        client.writeCoils(0, coils)

      }, 1003);

      setInterval(function() {

        client.writeRegisters(0, discrete)

      }, 1019);

      setInterval(function() {
        client.readDiscreteInputs(0, 8, function(err, data) {
            if (err) {
              console.log(err);
            }
            if (data) {
              console.log(data.data);
            }

        });
        
      }, 1037);

      setInterval(function() {
        client.readInputRegisters(0, 3, function(err, data) {
            if (err) {
              console.log(err);
            }
            if (data) {
              console.log(data.data);
              ws.send(JSON.stringify({topic: "AnalogOutput", payload: data.data[0]}));
            }

        });
        
      }, 1059);

      setInterval(function() {

          client.readCoils(0, 8, function(err, data) {
            if (err) {
              console.log(err);
            }
            if (data) {
              console.log(data);
            }

          });
      }, 1079);
      

      //   console.log('Client connected');

        ws.on('message', function(message) {
          console.log(message)
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
            coils[parseInt(m.topic)] = parseInt(m.payload)
            discrete[parseInt(m.topic)] = parseInt(m.payload)

        });

        ws.on('close', () => console.log('Client disconnected'));

    });

