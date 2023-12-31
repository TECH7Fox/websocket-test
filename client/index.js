const ws = await connectToServer();
printMessage({
    sender: "system",
    text: "Welcome to the chat!",
    color: "blue",
});

document.getElementById("btn").addEventListener("click", () => {
    const input = document.getElementById("input");
    const message = {
        sender: "client",
        text: input.value,
    };
    const outbound = JSON.stringify(message);
    ws.send(outbound);
    input.value = "";
});

document.getElementById("input").addEventListener("keyup", (event) => {
    if(event.key === "Enter") {
        document.getElementById("btn").click();
    }
});

sendMessage({
    sender: "client",
    text: "Connected to the chat!",
});

ws.onmessage = (webSocketMessage) => {
    const message = JSON.parse(webSocketMessage.data);
    printMessage(message);
};

function printMessage(message) {
    const box = document.getElementById("box");
    const div = document.createElement("div");
    div.innerText = `${message.sender}: ${message.text}`
    div.style.color = message.color;
    box.appendChild(div);
}

function sendMessage(message) {
    const outbound = JSON.stringify(message);
    ws.send(outbound);
}

async function connectToServer() {
    const ws = new WebSocket('ws://localhost:7071/ws');
    console.log("connecting");
    return new Promise((resolve, reject) => {
        const timer = setInterval(() => {
            if(ws.readyState === 1) {
                clearInterval(timer)
                resolve(ws);
            }
        }, 10);
    });
}