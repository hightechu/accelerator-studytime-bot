// Ping Module
const Discord = require('discord.js');
module.exports = {
    // Name of Command
    name: 'study-session',
    // Description of Command
    description: 'studysession',
    // Guild - TRUE
    guildOnly: true,
    // Cooldown
    cooldown: 50,
    // Execute Command - Parameters: message
    execute(message) {
        // Create Embed
        const embed = new Discord.MessageEmbed()
            .addFields(
            { name: 'Please start your timer!', value: '!timer [hh-dd-ss]', inline: true },
            );
        // Send Message
        message.channel.send(embed);
    },
};