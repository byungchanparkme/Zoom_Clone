import express from "express";
import WebSocket from "ws";
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
const server = http.createServer(app);

// WebSocket 서버 (같은 서버에서 http와 WebSocket 모두 작동)
const wss = new WebSocket.Server({server});

// socket : 연결된 브라우저
function handleConnection(socket) {
    console.log(socket);
}
// web socket을 이용해서 새로운 connection 을 기다림
wss.on('connection', handleConnection);

server.listen(3000, handleListen);