import express from "express";
import SocketIO from "socket.io";
import http from "http";

const app = express();

// express 는 pug 를 기본적으로 현재 작업 중인 디렉토리 src + /views 에서 찾는다.
app.set("view engine", "pug");
// express 가 pug 를 조회하는 경로 따로 지정
app.set("views", __dirname + "/views");
// express.static() : 정적 파일 제공
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req,res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on ws://localhost:3000`);

// http 서버
const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);

// Back-end 에서 socket.io 와 연결 준비 완료
wsServer.on("connection", socket => {
    socket.on("enter_room", (roomName, done) => {
        console.log(roomName);
        setTimeout(() => {
            done("Hello from the Backend");
        }, 5000);   
    });
})

/*
// WebSocket 서버 (같은 서버에서 http와 WebSocket 모두 작동)
const wss = new WebSocket.Server({server});

const onSocketClose = () => {
    console.log("Disconnected from the Browser ❌");
}

// fake database
const sockets = [];

// web socket을 이용해서 새로운 connection 을 기다림
// socket : 연결된 브라우저
wss.on('connection', (socket) => {
    sockets.push(socket);
    socket["nickname"] = "Anon";
    console.log("Connected to the Server ✅");
    socket.on("close", onSocketClose);
    
    socket.on("message", (msg) => {
        const message = JSON.parse(msg);
        console.log(message);
        switch(message.type) {
            case "new_message":
                sockets.forEach(aSocket => aSocket.send(`${socket.nickname} : ${message.payload}`));
            case "nickname":
                socket["nickname"] = message.payload;
        }
    });
});
*/
httpServer.listen(3000, handleListen);

