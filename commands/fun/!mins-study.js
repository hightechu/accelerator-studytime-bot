// Ping Module
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
        // Send Message
        message.channel.send('Please set your study and break time:');
    },
};