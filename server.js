const express = require('express');
const WebSocket = require('ws');
const PORT = process.env.PORT || 3000;


const path = require('path');
const server = express()
    .use(express.static(path.join(__dirname, '../flexdash/dist')))
    .listen(PORT, '172.23.155.158', () => {
        console.log(`Server listening on port ${PORT}!`)
    });

const wss = new WebSocket.Server({ server });


wss.on('connection', async (ws) => {




  var modbus = require("modbus-stream");

  modbus.tcp.connect(502, "172.23.154.137", { debug: "automaton-2454" }, (err, connection) => {
      console.log('connected !')
      if (err) throw err;
    let preres = 0;  
    while (true){
      connection.readCoils({ address: 1, quantity: 1, extra: { unitId: 1 } }, (err, res) => {
        // if (err) throw err;

        if (res.response.data[0] != preres) {
          console.log(res.response.data[0]); 
          var data = (res.response.data[0] = 0 ? 'OFF' : 'ON');
          ws.send(JSON.stringify({topic: '1', payload: data}))
        }
        
        preres = res.response.data[0];

    })

    }
      
  });





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

    ws.send(message)

    if (m.topic == '1' && m.payload =='ON') {
      // readmodbus()
      console.log(tcpDevice.stream)

    }

    console.log(m)
  });

});


