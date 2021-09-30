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
    socket.nickname = "Anon";

    // 프론트에서 Login 버튼 클릭 시 user_login 이벤트 감지 후 콜백 함수 실행 
    socket.on("user_login", (userInfo, showNickname) => {
        socket.nickname = userInfo.nickname;
        showNickname(socket.nickname);
    });
    
    socket.on("enter_room", (roomName, showRoom) => {
        socket.join(roomName);
        showRoom(roomName);   
        // "welcome" Event 를 방금 참가한 방 안에 있는 모든 사람에게 emit
        socket.to(roomName).emit("welcome", socket.nickname);
    });
    
    socket.on("new_message", (msg, room, showMessage) => {
        console.log(socket.nickname);
        // 방 안에 있고, 새로운 메세지 보낸 소켓 제외한 나머지에게
        socket.to(room).emit("new_message", socket.nickname, msg);
        showMessage(msg);
    });

    socket.on("disconnecting", reason => {
        // socket.rooms 는 Set 이어서 iterable (반복가능한) 객체임.
        socket.rooms.forEach(room => socket.to(room).emit("bye", socket.nickname));
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

