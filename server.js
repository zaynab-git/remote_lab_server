var wss = new (require('ws')).Server({port: (process.env.PORT || 8080)});
console.log('listening on port: ' + 8080);

wss.on('connection', function connection(ws, req) {
    
	ws.on('message', function(message) {

        var msg = JSON.parse(message);
        if ('topic' in msg && 'payload' in msg) {
            if (msg.topic == 'exe') {
                console.log('exe')
            }
            else if (msg.topic == 'bit') {
                console.log('bit')
            }
            else {
                ws.send(JSON.stringify(msg));
                console.log(msg);
            }
        }
        else {
            console.log('missing topic or payload')
        }
        
	});

	console.log('new client connected!');

});