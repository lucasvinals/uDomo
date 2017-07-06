const Websocket = require('ws');

class WebSocketuDomo {
  constructor(server) {
    return (path) => {
      this.Server = new Websocket.Server({ server, path: `/${ path }` });
      return this.Server.
      // this.Server.on('connection', (ws, req) => {
      //   this.Socket = ws;
      //   this.request = req;
      //   this.Socket.on('message', this.receiveMessage);
      // });
      // return this;
    };
  }

  emitMessage(type, message) {
    if (this.Socket) {
      const payload = JSON.stringify({ type, message });
      return this.Socket.send(payload);
    }
    throw new Error('WS is not ready yet...');
  }
  receiveMessage(payload) {
    console.log(payload)
  }
  // receiveMessage(payload) {
  //   console.log('Llega a processMessage con ', payload);
  //   try {
  //     this.payload = JSON.parse(payload);
  //   } catch (exception) {
  //     throw new Error('[Websocket] Cannot parse the request message');
  //   }
  //   console.log('Retorna de processMessage: ', payload);
  //   return (payload) => payload;
  // }
  // constructor(server) {
  //   this.Server = new Websocket.Server({ server });
  //   this.Server.on('connection', this.Connection);
  //   /**
  //    * Watcher to monitor connection
  //    */
  //   this.CheckConnection(this.Server);
  // }

  // CheckConnection(Server) {
  //   this.Server = Server;
  //   const TIME_PING_PONG = 15000;
  //   this.Server.on('pong', () => {
  //     this.isAlive = true;
  //   });

  //   const interval = setInterval(() =>
  //     this.Server.clients.forEach((conn) => {
  //       if (conn.isAlive === false) {
  //         clearInterval(interval);
  //         conn.terminate();
  //       }
  //       conn.isAlive = false;
  //       conn.ping('', false, true);
  //     }), TIME_PING_PONG
  //   );
  // }

  // Connection(ws, req) {
  //   const Console = console;
  //   Console.log('New connection from: ', req.connection.remoteAddress);
  //   return ws;
  // }

  // SetListeners(ws) {
  //   this.listeners = {
  //     emitMessage: (type, message) => ws.send(JSON.stringify({ type, message }), process.log.error),
  //     receiveMessage: (payload) => JSON.parse(payload),
  //   };
  // }
}

module.exports = WebSocketuDomo;
