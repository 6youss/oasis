import uws, { WebSocket } from "uWebSockets.js";

export const OPEN_SOCKETS = new Set<WebSocket>();

export const wsApp = uws.App().ws("/*", {
  /* There are many common helper features */
  idleTimeout: 32,
  maxBackpressure: 1024,
  maxPayloadLength: 512,
  compression: uws.DEDICATED_COMPRESSOR_3KB,

  /* For brevity we skip the other events (upgrade, open, ping, pong, close) */
  message: (ws, message, isBinary) => {
    /* You can do app.publish('sensors/home/temperature', '22C') kind of pub/sub as well */

    /* Here we echo the message back, using compression if available */
    let ok = ws.send(message, isBinary, true);
  },
  open: (ws) => {
    OPEN_SOCKETS.add(ws);
  },
  close: (ws) => {
    OPEN_SOCKETS.delete(ws);
  },
});
