## <p align="center"> <img width="500" height="100" src="https://socket.io/css/images/logo.svg"></p>

# **Members**

1. [Lê Hoàng Chương - 18600033](https://www.facebook.com/hoangchuong.30.1.2.00)
2. [Nguyễn Thị Hương - 18600106](https://www.facebook.com/cute.huongdino)
3. [Lê Gia Huy - 18600108](https://www.facebook.com/huygiale11)
4. [Vũ Cao Nguyên - 18600187](https://www.facebook.com/nguyen.fit.hcmus/)

# **Introduction**

## **What Socket.IO is**

Socket.IO is a library that enables real-time, bidirectional and event-based communication between the browser and the server. It consists of:

- a Node.js server: [Source](https://github.com/socketio/socket.io) | [API](https://socket.io/docs/v4/server-api/)
- a Javascript client library for the browser (which can be also run from Node.js): [Source](https://github.com/socketio/socket.io-client) | [API](https://socket.io/docs/v4/client-api/)

<p align="center"> <img src="https://socket.io/images/bidirectional-communication.png"></p>

## **How does that work?**

The client will try to establish a [WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket) connection if possible, and will fall back on HTTP long polling if not.

WebSocket is a communication protocol which provides a full-duplex and low-latency channel between the server and the browser. More information can be found [here](https://en.wikipedia.org/wiki/WebSocket).

## **Features**

Here are the features provided by Socket.IO over plain WebSockets:

- reliability (fallback to HTTP long-polling in case the WebSocket connection cannot be established)
- automatic reconnection
- [packet buffering](https://socket.io/docs/v4/client-offline-behavior/#Buffered-events)
- [acknowledgments](https://socket.io/docs/v4/emitting-events/#Acknowledgements)
- broadcasting to all clients or [to a subset of clients](https://socket.io/docs/v4/rooms/) (what we call “Room”)
- [multiplexing](https://socket.io/docs/v4/namespaces/) (what we call “Namespace”)

# **Demo Chat App**

## **Installation**

```
$ npm i --save socket.io
```

## **How to use**

### Sample code:
### `Server`
```js
io.on("connection", (socket) => {
  socket.emit("request" /* … */); // sending to sender-client only
  socket.broadcast.emit("broadcast" /* … */); // sending to all clients except sender
  io.emit("message" /* … */); // sending to all clients, include sender
  socket.on("reply", () => {
    /* … */
  }); // event listener, can be called on client to execute on server
});
```
### `Client`
```js
const socket = io("http://localhost:3000");
```

## **Setup**

### Folder Structure

```bash
├── public
│   ├── style.css
│   ├── index.html
│   ├── main.js
├── node_modules
├── index.js
├── README.md
├── package.json
└── .gitignore
```

### `package.json`

```json
{
  "name": "socket.io-chat",
  "version": "1.0.0",
  "description": "A simple chat client using socket.io",
  "main": "index.js",
  "author": "Nguyen",
  "private": true,
  "license": "MIT",
  "dependencies": {
    "express": "~4.17.1",
    "nodemon": "^2.0.7",
    "socket.io": "^4.0.1"
  },
  "scripts": {
    "start": "nodemon index.js"
  }
}
```

### `index.js`

```js
// Setup basic express server
const express = require("express");
const app = express();
const path = require("path");
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const port = process.env.PORT || 3000;

// Routing
app.use(express.static(path.join(__dirname, "public")));

// Chat Room
io.on("connection", (socket) => {
  /* … */
});

// Server listening
server.listen(port, () => {
  console.log(`🚀 Server listening at ${port}`);
});
```

### `index.html`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Socket.IO Chat Example</title>
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
    <ul class="pages">
      <li class="chat page">
        <div class="chatArea">
          <ul class="messages"></ul>
        </div>
        <input class="inputMessage" placeholder="Type here..." />
      </li>
    </ul>

    <script src="https://code.jquery.com/jquery-1.10.2.min.js"></script>
    <script src="/socket.io/socket.io.js"></script>
    <script src="/faker.js"></script>
    <script src="/main.js"></script>
  </body>
</html>
```

## **Deploying / Testing**

[https://chat-app-example-socketio.herokuapp.com](https://chat-app-example-socketio.herokuapp.com)

## **License**

[MIT](https://github.com/socketio/socket.io/blob/master/LICENSE)

## <p align="center"> <img src="https://i.imgur.com/O4DIM1F.png"></p>
