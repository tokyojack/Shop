const Command = require('../utils/command');

module.exports = new Command("test", (message, args, Discord) => {
        let embed = new Discord.RichEmbed()
        .setAuthor("Purchase")
        .setDescription("---")
        .setColor("009dc3")
        .addField("Payer Info:", `asd`)
        .addField("Items", "a");
        
    message.channel.send(embed);
});