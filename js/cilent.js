const socket = io('http://localhost:3000');

const form = document.getElementById('send-container')
const messageInput = document.getElementById('messageInput')
const messageContainer = document.querySelector(".container")
var audio=new Audio('ring.mp3')
const append = (message, position) => {
    const messageElement = document.createElement('div')
    messageElement.innerText = message
    if (position=='center'){

        messageElement.classList.add('JoinLeave')
    }
    else if(position=='left'){
        messageElement.classList.add('messageReceive')
        audio.play();
    }
    else{
        messageElement.classList.add('messageSend')
    }
    messageElement.classList.add(position)
    messageContainer.append(messageElement)
}
form.addEventListener('submit',(e)=>{
    e.preventDefault()
    const message=messageInput.value;
    append(`You:${message}`,'right');
    socket.emit('send',message);
    messageInput.value='';
    
})
const nameUser = prompt("Enter Your Name to Join")
socket.emit('new-user-joined', nameUser)
socket.on('user-joined', nameUser => {
    append(`${nameUser} joined the Chat`, 'center')
})
socket.on('receive', data => {
    append(`${data.name} : ${data.message}`, 'left')
})
socket.on('left', name => {
    append(`${name} left the Chat`, 'center')
})
