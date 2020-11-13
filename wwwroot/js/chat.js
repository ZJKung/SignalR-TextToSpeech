"use strict";

var connection = new signalR.HubConnectionBuilder()
    .withUrl("/client")
    .withAutomaticReconnect()
    .build();

//Disable send button until connection is established
document.getElementById("sendButton").disabled = true;

connection.on("ReceiveMessage", function (user, message) {
    var msg = JSON.parse(message);
    var encodedMsg = user + " says " + msg.Msg;
    var li = document.createElement("li");
    li.textContent = encodedMsg;
    document.getElementById("messagesList").appendChild(li);
    if (msg.AudioStream) {
        document.getElementById("audio_player").src = "data:audio/mp3;base64," + msg.AudioStream;
        document.getElementById("audio_player").play();
    }
});

connection.start().then(function () {
    document.getElementById("sendButton").disabled = false;
}).catch(function (err) {
    return console.error(err.toString());
});

document.getElementById("sendButton").addEventListener("click", function (event) {
    var user = document.getElementById("userInput").value;
    var message = document.getElementById("messageInput").value;
    connection.invoke("SendMessage", user, message).catch(function (err) {
        return console.error(err.toString());
    });
    event.preventDefault();
});