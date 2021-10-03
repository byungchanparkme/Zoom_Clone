// io function 은 알아서 socket.io 를 실행하고 있는 서버를 알아서 찾음.
const socket = io();

const login = document.getElementById("login");
const loginForm = login.querySelector("form");

const welcome = document.getElementById("welcome");
const roomForm = welcome.querySelector("form");

const room = document.getElementById("room");
const messageList = room.querySelector("ul");
const messageForm = room.querySelector("form");
const message = document.getElementById("message");

// roomName 을 전역 변수로 선언 (어디서든 접근 가능하도록)
let roomName;

welcome.hidden = true;
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

function showMessageWithNickname(nickname, msg) {
    const item = document.createElement('li');
    item.textContent = `${nickname} : ${msg}`;
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

// Login 버튼 클릭 시 콜백 함수 동작
const handleLoginSubmit = event => {
    event.preventDefault();
    const input = loginForm.querySelector("input");
    const value = input.value;
    // 입력한 nickname 값을 서버에 전달
    socket.emit("user_login", { nickname: value });
    input.value = '';
    // loginForm disappears
    login.hidden = true;
    // enterRoomForm appears
    welcome.hidden = false;
    // show RoomList
    socket.on("room_change", (rooms) => {
        const roomList = welcome.querySelector("ul");
        roomList.innerHTML = '';

        if (rooms.length === 0) {
            return;
        }
        rooms.forEach(room => {
            const li = document.createElement('li');
            li.innerText = room;
            roomList.appendChild(li);
        });
    });
}

roomForm.addEventListener("submit", handleRoomSubmit);
messageForm.addEventListener("submit", handleMessageSubmit);
loginForm.addEventListener("submit", handleLoginSubmit);

socket.on("welcome", (user, newCount) => {
    const h3 = room.querySelector("h3");
    h3.textContent = `Room ${roomName} (${newCount})`; 
    showMessage(`${user} joined!`);
});
socket.on("bye", (user, newCount) => {
    const h3 = room.querySelector("h3");
    h3.textContent = `Room ${roomName} (${newCount})`;
    showMessage(`${user} left ㅠㅠ`);
});
socket.on("new_message", (nickname, msg) => {
    showMessageWithNickname(nickname, msg);
});
socket.on("room_change", (rooms) => {
    const roomList = welcome.querySelector("ul");
    roomList.innerHTML = "";

    if (rooms.length === 0) {
        return;
    }
    rooms.forEach(room => {
        const li = document.createElement('li');
        li.innerText = room;
        roomList.appendChild(li);
    });
});