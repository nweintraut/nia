var Chat = function(socket) {
    this.socket = socket;
};

Chat.prototype.sendMessage = function(room, text) {
    alert("Room is [" + "]" + "Text is [" + text +"]");
    var message = {room: room, text: text};
    this.socket.emit('message', message);
};

Chat.prototype.changeRoom = function(room) {
    this.socket.emit('join', {newRoom: room});
};
Chat.prototype.processCommand = function(message) {
    var words = message.split(' ');
    var command = words[0].substring(1, words[0].length).toLowerCase();
    var result = false;
    switch(command) {
        case 'join':
            words.shift();
            var room = words.join(' ');
            this.changeRoom(room);
            break;
        case 'nick':
            words.shift();
            var name = words.join(' ');
            this.socket.emit('nameAttempt', name);
            break;
        default:
            result = 'Unrecognized command.';
            break;
    }  
    return result;
};
