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
            { name: 'Please specify your study and break time', value: ':)', inline: true },
            { name: 'Please specify your study session duration', value: '!minstudy_ ', inline: true },
            { name: 'How many 10-minute breaks would you like to have?', value: '!breaks_', inline: true }
            );
        // Send Message
        message.channel.send(embed);
    },
};