const Command = require('../utils/command');

module.exports = new Command("",(message, args, Discord) => {
    message.channel.send("Unknown command");
});