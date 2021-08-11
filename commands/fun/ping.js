// Ping Module
module.exports = {
    // Name of Command
    name: 'hello',
    // Description of Command
    description: 'hello!',
    // Guild - TRUE
    guildOnly: true,
    // Cooldown
    cooldown: 50,
    // Execute Command - Parameters: message
    execute(message) {
        // Send Message
        message.channel.send('Hello! Welcome to StudyTime! Start your study session right away!');
    },
};