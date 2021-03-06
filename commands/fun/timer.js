const Discord = require('discord.js');

const HOURS_TO_MILLISECONDS = 3600000;
const MINUTES_TO_MILLISECONDS = 60000;
const SECONDS_TO_MILLISECONDS = 1000;

const SERVER_TIMEZONE = String(String(new Date()).split("(")[1]).split(")")[0];

const TimerHelp = `**Usage:**
\`\`\`
!timer {dd:hh:mm:ss | hh:mm:ss} {timezone}
\`\`\`
\`duration\`: _\`!timer\` command must include a duration in the format \`dd:hh:mm:ss\`, \`hh:mm:ss\`, \`mm:ss\`, \`0s\` or include the \`--help\` flag._
\`timezone\`: _An optional timezone to use for status updates of the alarm clock. Defaults to server time if no timezone option is present (for a full list of acceptable timezone options and formats see: https://github.com/drewstaylor/discord-timer-ai/blob/main/timezones.js)_
**Example:**
> RichGirlOnLSD Today at 8:18 PM
> !timer 00:01:30 Europe/Vienna
> Timer AI BOT Today at 8:18 PM
> @RichGirlOnLSD, New timer started at 10/5/2020, 2:18:24 AM Europe/Vienna, for a duration of 0 hours, 1 minutes and 30 seconds.
> @RichGirlOnLSD, Timer finished finished in 0 hours, 1 minutes and 30 seconds. Alarm finished time is 10/5/2020, 2:19:54 AM Europe/Vienna`;

const AlarmHelp = `**Usage:**
\`\`\`
!alarm {date} {timezone}
\`\`\`
\`date\`: *Must be either a date string or timestamp in milliseconds. If a string formatted date is used, timezone must be declared like \`--timezone=America/New_York\`, unix timestamps timezone can be declared as either \`--timezone=America/New_York\` or \`America/New_York\`*
\`timezone\`: _An optional timezone to use for status updates of the alarm clock. Defaults to server time if no timezone option is present (for a full list of acceptable timezone options and formats see: https://github.com/drewstaylor/discord-timer-ai/blob/main/timezones.js)_
**Example 1) Date string:**
> RichGirlOnLSD Today at 10:27 PM
> !alarm Sun Oct 04 2020 22:28:00 --timezone=Europe/Moscow
> Timer AI BOT Today at 10:27 PM
> Alarm set for 10/5/2020, 5:28:00 AM
> Alarm finished in 0 hours, 0 minutes and 1.06 seconds. Alarm finished time is 10/5/2020, 5:28:00 AM Europe/Moscow
**Example 2) Timestamp:**
> RichGirlOnLSD Today at 10:34 PM
> !alarm 1601865279069
> Timer AI BOT Today at 10:34 PM
> Alarm set for 10/4/2020, 10:34:39 PM (Eastern Daylight Time)
> Alarm finished in 0 hours, 0 minutes and 19.41 seconds. Alarm finished time is 10/4/2020, 10:34:39 PM (Eastern Daylight Time)`;


const client = new Discord.Client();

module.exports = {
  // Name of Command
  name: 'timer',
  // Description of Command
  description: 'timer',
  // Guild - TRUE
  guildOnly: true,
  // Cooldown
  cooldown: 50,
  usage: '[hh-mm-ss]',
    // Arguments TRUE
    args: true,
  // Execute Command - Parameters: message
  execute(message, args) {
    const embed = new Discord.MessageEmbed() // Ver 12.2.0 of Discord.js
  .setTitle("The Crow and the Pitcher")
  .setDescription("Save the crow!")
  .setTimestamp()
  .setFooter("StudyTime")
  .setAuthor("StudyTime")
  .setImage("https://cdn.discordapp.com/attachments/875437578688548907/875857748963753994/image0.gif")
  message.channel.send(embed);
    process_message(message)
  }
}

/**
 * Takes a calculation in seconds and converts it to an object 
 * with days, hours, minutes and seconds attributes
 * @param {Number} totalSeconds 
 * @returns {Object}
 */
function secondsToHMS(totalSeconds) {
  let hours = Math.floor(totalSeconds / 3600);
  totalSeconds %= 3600;
  let minutes = Math.floor(totalSeconds / 60);
  let seconds = totalSeconds % 60;
  // Toggle days
  if (hours < 24) {
    return {h: hours, m: minutes, s: seconds};
  } else {
    let days = Math.floor(hours / 24);
    hours = hours % 24;
    return {d: days, h: hours, m: minutes, s: seconds};
  }
};

// Client login
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

/**
 * Main chat bot worker:
 * 
 * !timer
 * Bot message type 1) `!timer`
 * Takes a time duration from chat and returns a timer notification
 * @see `!timer --help`
 * 
 * !alarm
 * Bot message type 2) `!alarm`
 * Takes a date string from chat and returns an alarm notification
 * @see `!alarm --help`
 */
function process_message(msg){
  // !timer handler
  if (msg.content.substring(0,6) === '!timer') {
    if (msg.content.indexOf('--help') !== -1) {
      let helpReply = TimerHelp;
      return msg.reply(helpReply);
    }
    let msgPieces = msg.content.split(' ');
    console.log(msgPieces)
    let end,
        rawEnd,
        seconds,
        minutes,
        hours,
        now = new Date(),
        timezone;
    if (msgPieces.length < 2) {
      // Debug:
      console.log('msgPieces less than 2');
      return msg.reply('I don\'t understand, tell me more ????');
    }

    // Start worker
    try {
      // Parse user args
      if (msgPieces.length === 3) { 
        timezone = msgPieces[2];
        if (Timezones.indexOf(timezone) < 0) {
          let tzUrl = "https://gist.github.com/drewstaylor/ded816531ca8632062e1fb93b30a270b";
          return msg.reply('What a strange timezone you live in, I don\'t understand ' + timezone + ' ????. See ' + tzUrl + ' for a list of supported timezones.');
        }
      } else {
        timezone = false;
      }
      rawEnd = msgPieces[1];
      // Split arg entities
      let tmpEnd = rawEnd.split('-');
      console.log(tmpEnd[0],tmpEnd[1]);
      switch (tmpEnd.length) {
        case 1:
          hours = 0;
          minutes = 0;
          seconds = parseInt(tmpEnd[0]);
          console.log(seconds);
          break;
        case 2:
          hours = 0;
          minutes = parseInt(tmpEnd[0]);
          seconds = parseInt(tmpEnd[1]);
          break;
        case 3:
          hours = parseInt(tmpEnd[0]);
          minutes = parseInt(tmpEnd[1]);
          seconds = parseInt(tmpEnd[2]);
          console.log(hours, minutes, seconds);
          break;
        case 4:
          let days = parseInt(tmpEnd[0]);
          hours = parseInt(tmpEnd[1]) + (days * 24);
          minutes = parseInt(tmpEnd[2]);
          seconds = parseInt(tmpEnd[3]);
          break;
        default:
          // Debug:
          console.log('Entities split length greater than 4');
          return msg.reply('I don\'t understand, tell me more ????');
      }

      // Calculate alarm end
      end = now.getTime();
      end += hours * HOURS_TO_MILLISECONDS;
      end += minutes * MINUTES_TO_MILLISECONDS;
      end += seconds * SECONDS_TO_MILLISECONDS;

      // Alarm args
      let start = now.getTime();
      let finished = (end - start);
      let asSeconds = finished / SECONDS_TO_MILLISECONDS;
      let HMS = secondsToHMS(asSeconds);
      let alarmResolved;
      let alarmMsg;
      if (HMS.hasOwnProperty('d')) {
        alarmMsg = 'Timer finished in ' + HMS.d + ' days, ' + HMS.h + ' hours, ' + HMS.m + ' minutes and ' + HMS.s + ' seconds.';
      } else {
        alarmMsg = 'Timer finished in ' + HMS.h + ' hours, ' + HMS.m + ' minutes and ' + HMS.s + ' seconds.';
      }

      // Create alarm
      setTimeout(() => {
        if (timezone) {
          alarmResolved = new Date().toLocaleString("en-US", {timeZone: timezone});
          alarmResolved += ' ' + timezone;
        } else {
          alarmResolved = new Date().toLocaleString("en-US")  + ' (' + SERVER_TIMEZONE + ')';
        }
        alarmMsg += ' Alarm finished time is ' + alarmResolved;
        msg.reply(alarmMsg);
      }, finished);

      // Update channel with alarm start
      let startS = (!timezone) ? new Date().toLocaleString("en-US") + ' (' + SERVER_TIMEZONE + ')' : new Date().toLocaleString("en-US", {timeZone: timezone}) + ' ' + timezone;
      let duration;
      if (HMS.hasOwnProperty('d')) {
        duration = HMS.d + ' days, ' + HMS.h + ' hours, ' + HMS.m + ' minutes and ' + HMS.s + ' seconds.';
      } else {
        duration = HMS.h + ' hours, ' + HMS.m + ' minutes and ' + HMS.s + ' seconds.';
      }
      let alarmCreateMsg = 'New timer started at ' + startS + ', for a duration of ' + duration;
      msg.reply(alarmCreateMsg);
    // Throw
    } catch(e) {
      // Debug
      console.log('Parser threw', e.message);
      return msg.reply('I don\'t understand, tell me more ????');
    }
  }

  // !alarm
  if (msg.content.substring(0,6) === '!alarm') {
    if (msg.content.indexOf('--help') !== -1) {
      let helpReply = AlarmHelp;
      return msg.reply(helpReply);
    }
    
    let msgPieces = [],
        alarm,
        timer,
        timeDiff;
    
    // Parse user args
    let al;
    if (msg.content.indexOf('--timezone=') > -1) {
      let tz = msg.content.split('--timezone=');
      timezone = tz[1].trim();
      al = tz[0].trim();
      if (al.indexOf('!alarm') > -1) {
        al = al.split('!alarm');
        if (al.length > 1) {
          al = al[1].trim();
          msgPieces.push(al)
        }
      }
    } else {
      al = msg.content.split('!alarm');
      if (al.length > 1) {
        al = al[1].trim();
        msgPieces.push(al)
      }
      timezone = false;
    }

    // Parse args
    try {
      if (!isNaN(msgPieces[0])) {
        msgPieces[0] = parseInt(msgPieces[0]);
      }
      
      // Alarm date
      alarm = new Date(msgPieces[0]);
      
      // Start / end ref.
      timer = {
        start: new Date().getTime(),
        end: alarm.getTime()
      };

      // End time must be forward facing
      if (timer.start > timer.end) {
        return msg.reply('Trouble parsing your end time, this isn\'t Back 2 the Future 3 ????'); 
      } else {
        timeDiff = timer.end - timer.start;
      }

      
    }catch(e){}
  }
  };

