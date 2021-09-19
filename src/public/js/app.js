const messageList = document.querySelector("ul");
const messageForm = document.querySelector("form");

// 서버로의 연결
const socket = new WebSocket(`ws://${window.location.host}`); 

const handleOpen = () => {
    console.log("Connected to the Server ✅");
}
const handleMessage = (message) => {
    console.log("New Message : ", message.data);
}
const handleClose = () => {
    console.log("Disconnected from the Server ❌");
}

// 서버와 연결되었을 때 이벤트 감지
socket.addEventListener('open', handleOpen);

// 서버로부터 메세지를 받을 때 이벤트 감지
socket.addEventListener('message', handleMessage);

// 서버와 연결이 끊어졌을 때 이벤트 감지
socket.addEventListener('close', handleClose);

const handleSubmit = (event) => {
    event.preventDefault();
    const messageInput = messageForm.querySelector("input");
    console.log(typeof messageInput.value)
    socket.send(messageInput.value);
    messageInput.value = '';
}

messageForm.addEventListener("submit", handleSubmit);