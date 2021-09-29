// io function 은 알아서 socket.io 를 실행하고 있는 서버를 알아서 찾음.
const socket = io();

const welcome = document.getElementById("welcome");
const roomForm = welcome.querySelector("form");

const room = document.getElementById("room");
const messageList = room.querySelector("ul");
const messageForm = room.querySelector("form");
const message = document.getElementById("message");

// roomName 을 전역 변수로 선언 (어디서든 접근 가능하도록)
let roomName;

room.hidden = true;

function showRoom(roomName) {
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector("h3");
    h3.textContent = `Room ${roomName}`;    
}

function showMessage(msg) {
    const item = document.createElement('li');
    item.textContent = msg;
    messageList.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
}


const handleRoomSubmit = (event) => {
    event.preventDefault();
    const input = roomForm.querySelector("input");
    socket.emit("enter_room", input.value, showRoom);
    // enter_room 할 때 roomName 값 저장
    roomName = input.value;
    input.value = "";
}

const handleMessageSubmit = event => {
    event.preventDefault();
    const input = messageForm.querySelector("input");
    // 초기화되기 전에 미리 값 저장
    const value = input.value;
    // roomName 값을 어디서 가지고 오지? 
    // >> roomName 전역 변수 선언 -> enter_room 이벤트 발생 시 값 저장
    // callback fn 는 input 값 초기화된 이후에 실행됨. 
    socket.emit("new_message", input.value, roomName, () => {
        showMessage(`You: ${value}`);
    });
    input.value = "";
}

roomForm.addEventListener("submit", handleRoomSubmit);
messageForm.addEventListener("submit", handleMessageSubmit);

socket.on("welcome", () => {
    showMessage("someone joined!");
});
socket.on("bye", () => {
    showMessage("someone left ㅠㅠ");
});
socket.on("new_message", (msg) => {
    showMessage(msg);
});