const messageList = document.querySelector("ul");
const messageForm = document.querySelector("#message");
const nickForm = document.querySelector("#nick");

// 서버로의 연결
const socket = new WebSocket(`ws://${window.location.host}`); 

const makeMessage = (type, payload) => {
    const msg = { type, payload };
    return JSON.stringify(msg);
}

const handleOpen = () => {
    console.log("Connected to the Server ✅");
}
const handleMessage = (message) => {
    const li = document.createElement("li");
    li.innerText = message.data;
    messageList.append(li);
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

const handleMsgSubmit = (event) => {
    event.preventDefault();
    const messageInput = messageForm.querySelector("input");
    console.log(typeof messageInput.value)
    socket.send(makeMessage("new_message", messageInput.value));
    messageInput.value = '';
}

const handleNickSubmit = (event) => {
    event.preventDefault();
    const nickInput = nickForm.querySelector("input");
    socket.send(makeMessage("nickname", nickInput.value));
    nickInput.value = "";
}

messageForm.addEventListener("submit", handleMsgSubmit);
nickForm.addEventListener("submit", handleNickSubmit);