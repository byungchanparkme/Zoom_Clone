// 서버로의 연결
const socket = new WebSocket(`ws://${window.location.host}`); 

// 서버와 연결되었을 때 이벤트 감지
socket.addEventListener('open', () => {
    console.log("Connected to the Server ✅");
});

// 서버로부터 메세지를 받을 때 이벤트 감지
socket.addEventListener('message', (message) => {
    console.log("New Message : ", message.data);
});

// 서버와 연결이 끊어졌을 때 이벤트 감지
socket.addEventListener('close', () => {
    console.log("Disconnected from the Server ❌");
});

setTimeout(() => {
    socket.send("Hello from the Browser!!!")
}, 10000);