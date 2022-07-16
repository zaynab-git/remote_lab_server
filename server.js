const express = require('express');
const WebSocket = require('ws');
const PORT = process.env.PORT || 8080;


const path = require('path');
const server = express()
    .use(express.static(path.join(__dirname, '../flexdash/dist')))
    .listen(PORT, "172.23.155.158", () => {
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

      // setInterval(function() {

      //   client.writeCoils(0, coils)

      // }, 1003);

      // setInterval(function() {

      //   client.writeRegisters(0, discrete)

      // }, 1019);

      setInterval(function() {
        client.readDiscreteInputs(8, 8, function(err, data) {
            if (err) {
              console.log(err);
            }
            if (data) {
              let inp0 = data.data[0] == true ? 1 : 0
              let inp1 = data.data[1] == true ? 1 : 0
              let inp2 = data.data[2] == true ? 1 : 0
              let inp3 = data.data[3] == true ? 1 : 0
              let inp4 = data.data[4] == true ? 1 : 0
              let inp5 = data.data[5] == true ? 1 : 0
              let inp6 = data.data[6] == true ? 1 : 0
              let inp7 = data.data[7] == true ? 1 : 0
              ws.send(JSON.stringify({topic: "0", payload: inp0}));
              ws.send(JSON.stringify({topic: "1", payload: inp1}));
              ws.send(JSON.stringify({topic: "2", payload: inp2}));
              ws.send(JSON.stringify({topic: "3", payload: inp3}));
              ws.send(JSON.stringify({topic: "4", payload: inp4}));
              ws.send(JSON.stringify({topic: "5", payload: inp5}));
              ws.send(JSON.stringify({topic: "6", payload: inp6}));
              ws.send(JSON.stringify({topic: "7", payload: inp7}));
            }
        });
        
      }, 1037);

      setInterval(function() {
        client.readInputRegisters(0, 3, function(err, data) {
            if (err) {
              console.log(err);
            }
            if (data) {
              // console.log(data.data);
              ws.send(JSON.stringify({topic: "AnalogOutput", payload: data.data[0]}));
            }

        });
        
      }, 1059);

      // setInterval(function() {

      //     client.readCoils(0, 8, function(err, data) {
      //       if (err) {
      //         console.log(err);
      //       }
      //       if (data) {
      //         console.log(data);
      //       }

      //     });
      // }, 1079);
      

      //   console.log('Client connected');

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
            coils[parseInt(m.topic)] = parseInt(m.payload)
            discrete[parseInt(m.topic)] = parseInt(m.payload)

        });

        ws.on('close', () => console.log('Client disconnected'));

    });


