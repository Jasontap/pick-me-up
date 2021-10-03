const { db } = require('./db');
const app = require('./api');
const syncAndSeed = require('./db/syncAndSeed');
const ws = require('ws');

const init = async () => {
	try {
    if (process.env.SEED){
		  await syncAndSeed();
    }
    else {
      await db.sync()
    }
		const port = process.env.PORT || 3000;

		const server = app.listen(port, () => console.log(`listening on port ${port}`));
		const webSocketServer = new ws.Server({ server });


		let sockets = [];

		webSocketServer.on('connection', (socket)=> {
			// adds new connection to sockets array to keep track of all connected clients
			sockets.push(socket);
			// socket.send(JSON.stringify({ history: messages }));
			// this filters out the socket where the message is coming from so it only broadcasts to all other clients 
			socket.on('message', (data)=> {
				sockets.filter(s => s !== socket).forEach(s => s.send(data));
			});
			// this filters out sockets that have disconnected so messages only go to currently connected clients
			socket.on('close', ()=> {
				sockets = sockets.filter(s => s !== socket);
			});
		});
	} catch (ex) {
		console.log(ex);
	}
};

init();
