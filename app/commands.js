require('dotenv').config({path: '.env'});

const settings = require('./settings.js'),
      Discord  = require('discord.js'),
      core     = require('./core.js'),
      request  = require('request');
      fs       = require('fs'),
      env      = process.env;

let self = module.exports = {
  help: { // When we get above 25 commands will need to add pagination or some other method as embed limit is 25 fields
    desc: 'Lists all available commands.',
    args: '',
    execute: (client, msg) => {
      let pf = core.getGuild(client, msg.guild).prefix;

      let embed = new Discord.RichEmbed().setAuthor('command me daddy', client.user.avatarURL).setColor(3447003)
      
      for (var cmd in module.exports) {
        if (cmd) embed.addField('\u200B', `**${pf}${cmd} ${module.exports[cmd].args}**\n${module.exports[cmd].desc}`);
      }
      
      msg.delete().then().catch(console.error);
      msg.channel.send({embed});
    }
  },
  // settings: {
  //   desc: 'List current settings for the bot.',
  //   args: '<setting> <change>',
  //   execute: (client, msg, args) => {
  //     let space = '\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020';

  //     let embed = new Discord.RichEmbed()
  //       .setColor(3447003)
  //       .setDescription(`:joystick:  Run <settings> <setting name> for more information \n ${space} Run <settings> <setting name> <change> to edit`)
  //       .setThumbnail(client.user.avatarURL)
  //       .addBlankField(true);

  //     for (var setting in settings) {
  //       embed.addField('\u200B', `**${settings[setting].name}**\n ${space} ${settings[setting].desc}`);
  //     }

  //     msg.delete().then().catch(console.error);
  //     msg.channel.send({embed});
  //   }
  // },
  loc: {
    desc: 'Returns the bot\'s environment.',
    args: '',
    execute: (client, msg) => {
      msg.channel.send(`chillin' at ${env.LOC}`);
      client.user.setPresence({game: {name: `in ${env.LOC}`, type: 0}});
    }
  },
  r: {
    desc: 'Rates a meme.',
    args: '<integer between 0 and 5>',
    valid: (i) => {
      return i >= 0 && i <= 5;
    },
    execute: (client, msg, args) => {
      if (!self.r.valid(args[0])) return msg.reply('gimme dat fatty number between 0-5 ya\'dig');

      msg.delete().then().catch(console.error);

      msg.channel.send(msg.member.nickname || msg.author.username, {
        file: `app/resources/responses/rate/${args[1]}.png`
      }).catch(error => msg.reply(`Small **oof** my dude: ${error}`));
    }
  },
  change: {
    desc: 'Changes the name of the bot.',
    args: '<string: no spaces... for now>',
    execute: (client, msg, args) => {
      let name = '';

      args.forEach(arg => { name += arg + ' ' });

      msg.guild.member(client.user).setNickname(name).then(() => {
        msg.channel.send(`just call me ${name}`);
      }).catch(error => msg.reply(`Small **oof** my dude: ${error}`));
    }
  },
  reset: {
    desc: 'Resets the name of the bot.',
    args: '',
    execute: (client, msg) => {
      msg.guild.member(client.user).setNickname('Jarfis').then(() => {
        msg.channel.send(`reverting to Jarfis. Don't fuck me up again I'm a soft boy`);
      }).catch(error => msg.reply(`Small **oof** my dude: ${error}`));
    }
  },
  flip: {
    desc: 'Flip a coin.',
    args: '',
    execute: (client, msg) => { // Should be more modular and less shit
      let heads = 'https://i.gyazo.com/e380b49fc9e2b8b86571975f7df01d52.gif';
      let tails = 'https://i.gyazo.com/8697b5c1f85e43ec9580bc59727c5fcc.gif';
      let res = (Math.floor(Math.random() * 2) === 0) ? 'heads' : 'tails';
      let embed = new Discord.RichEmbed()
        .setColor((res === 'heads' ? '3232ff' : 'FFD700'))
        .setTitle(`it's ${res} motherfucker`)
        .setThumbnail((res === 'heads' ? heads : tails))
        .addBlankField(true);

      msg.channel.send({embed});
    }
  },
  rc: {
    desc: 'RaNCApS YOUR TeXt.',
    args: '<string>',
    execute: (client, msg, args) => {
      if (!args.length) return msg.reply(`Small **oof** my dude I need some text`);

      let str = '';

      args.forEach(arg => { str += arg + ' ' });

      let a = str.split('');
      let n = a.length;

      for (i = n - 1; i >= 0; i--) {
        let r = Math.floor(Math.random() * n) + 1;
        a[r] = (a[r] ? a[r].toUpperCase() : '');
      }

      msg.delete().then().catch(console.error);

      msg.channel.send(a.join('')).catch(error => msg.reply(`Small **oof** my dude: ${error}`));
    }
  },
  clear: {
    desc: 'Hide the edge.',
    args: '',
    execute: (client, msg) => {
      msg.delete().then().catch(console.error);

      msg.channel.send('.\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n+--------+\n+**CLEAR**+\n+--------+');
    }
  },
  think: {
    desc: 'Shows a random thinking emoji',
    args: '',
    execute: (client, msg) => {
      let filePath = './app/resources/responses/think/';

      fs.readdir(filePath, (err, data) => {
        if (err) {
          console.log(err);
        } else {
          let r = Math.floor(Math.random() * data.length);
          let selection = filePath + data[r];

          msg.delete().then().catch(console.error);

          msg.channel.send({ file: selection }).catch(error => msg.reply(`Small **oof** my dude: ${error}`));
        }
      });
    }
  },
  echo: {
    desc: 'Speak on Jarfis\' behalf.',
    args: '<string>',
    execute: (client, msg, args) => {
      if (!args.length) return msg.reply(`Small **oof** my dude I need some text`);

      let str = '';

      args.forEach(arg => { str += arg + ' ' });

      msg.delete().then().catch(console.error);

      msg.channel.send(str).catch(error => msg.reply(`Small **oof** my dude: ${error}`));
    }
  },

  // Bans
  ban: {
    desc: 'Stop people *cough* Ramon *cough* from issuing commands',
    args: '<user>',
    execute: (client, msg, args) => {
      let id   = args[0].replace(/<@!(\d*)>|<@(\d*)>/g, '$1'), // grab ID from <!id> or <id>
          user = core.getUser(client, id);

      if (user.banned) return msg.channel.send(`<@${id}> is already banned my dude`);
      
      user.banned = true;
      
      client.losers.set(id, user);
      
      msg.channel.send(`<@${id}> is now banned`);
    }
  },
  unban: {
    desc: 'For when you\'ve had enough :dsd: for one day',
    args: '<user>',
    execute: (client, msg, args) => {
      let id   = args[0].replace(/<@!(\d*)>|<@(\d*)>/g, '$1'), // grab ID from <!id> or <id>
          user = core.getUser(client, id);

      if (!user.banned) return msg.channel.send(`<@${id}> isn't even banned you ***idiot***`);
      
      user.banned = false;
      
      client.losers.set(id, user);
      
      msg.channel.send(`<@${id}> is now unbanned`);
    }
  },

  // Responses
  add: {
    desc: 'Add a trigger and response to the bot',
    args: '"Trigger" "Response"',
    execute: (client, msg, args) => {
      if (args.length < 2) return msg.channel.send("Small **oof** my dude please give me two inputs");
      
      let server = core.getGuild(client, msg.guild);
      let str = '';

      args.forEach(arg => { str += arg + ' ' });

      let text = str.match(/"([^"]|"")*"/g); // Array of all matches (text in "")

      try {
        var trigger = text[0].replace(/['"]+/g, ''); // Shitty quote removal
        var response = text[1].replace(/['"]+/g, '');
      } catch (e) {
        console.log('args error: \n' + e);
        return msg.channel.send('Small **oof** my dude check your quotes');
      }

      if (server.responses[trigger]) return msg.channel.send('be more original - trigger already exists').catch(error => msg.reply(`Small **oof** my dude: ${error}`));
      
      server.responses[trigger] = response;

      core.setGuild(client, msg.guild.id, server);

      msg.channel.send('*I\'ll remember that*').catch(error => msg.reply(`Small **oof** my dude: ${error}`));
    }
  },
  remove: {
    desc: 'Delete a trigger and response from the bot',
    args: '"Trigger"', 
    execute: (client, msg, args) => {
      if (!args.length) return msg.channel.send("Small **oof** my dude please give me one input");
      
      let server = core.getGuild(client, msg.guild);
      let str = '';

      args.forEach(arg => { str += arg + ' ' });

      let text = str.match(/"([^"]|"")*"/g); // Array of all matches (text in "")

      try {
        var trigger = text[0].replace(/['"]+/g, ''); // Shitty quote removal
      } catch (e) {
        console.log('args error: \n' + e);
        return msg.channel.send('Small **oof** my dude check your quotes');
      }

      if (!server.responses[trigger]) return msg.channel.send('couldn\'t find that trigger, maybe learn to spell?').catch(error => msg.reply(`Small **oof** my dude: ${error}`));

      delete server.responses[trigger];

      core.setGuild(client, msg.guild.id, server);

      msg.channel.send(`I've removed \`${trigger}\` from your responses`).catch(error => msg.reply(`Small **oof** my dude: ${error}`));
    }
  },
  responses: {
    desc: 'List all the triggers and responses written to the bot',
    args: '',
    execute: (client, msg) => {
      let guild = core.getGuild(client, msg.guild);

      let embed = new Discord.RichEmbed()
        .setAuthor(`${client.user.username}'s Responses`, client.user.avatarURL)
        .setColor(3447003)
        
      for (let res in guild.responses) {
        if (guild.responses.hasOwnProperty(res)) embed.addField('\u200B', `**${res}**\n${guild.responses[res]}`, true);
      }

      msg.delete().then().catch(console.error);
      msg.channel.send({embed});
    }
  },
  clap: {
    desc: ':clap:get:clap:your:clap:point:clap:across:clap:',
    args: '<string>(-raw)',
    execute: (client, msg, args) => {
      let clap = ':clap:';
      
      if (args[0] === '-raw') {
        clap = '\\👏';
        args.splice(0, 1);
      }
      
      let str = clap; // Prepend a clap
      
      args.forEach(arg => { str += arg + clap });

      msg.delete().then().catch(console.error);
      msg.channel.send(str);
    }
  },
  banner: {
    desc: 'Turn your text into 🇪 🇲 🇴 🇯 🇮',
    args: '<string> A-Z and 0-9',
    execute: (client, msg, args) => {
      if (!args.length) return msg.reply(`Small **oof** my dude I need some text`);
      
      let str = '';

      args.forEach(arg => { str += arg + ' ' });

      let numStr = [':zero:', ':one:', ':two:', ':three:', ':four:', ':five:', ':six:', ':seven:', ':eight:', ':nine:'];
      let a = str.toLowerCase()
        .replace(/([a-z])/g, ':regional_indicator_$1: ')
        .replace(/([0-9])/g, $1 => numStr[$1] );

      msg.delete().catch(console.error);
      msg.channel.send(a).catch(error => msg.reply(`Small **oof** my dude: ${error}`));
    }
  },
  drake: {
    desc: 'Generate a dank memay',
    args: '"Top Text" "Bottom Text"',
    execute: (client, msg, args) => {
      // Hard code one as an example, need to think about a more dynamic approach
      // For all the legit new cool mems on the block dawg
      if (args.length < 2) return msg.channel.send("Small **oof** my dude please give me two inputs my dude");
      
      let str = '';

      args.forEach(arg => { str += arg + ' ' });

      memeText = str.match(/"([^"]|"")*"/g); // Array of all matches (text in "")

      try {
        var text1 = memeText[0].replace(/['"]+/g, '').toUpperCase(); // Shitty quote removal
        var text2 = memeText[1].replace(/['"]+/g, '').toUpperCase();
      } catch (e) {
        console.log('args error: \n' + e);
        return msg.channel.send('Small **oof** my dude check your quotes');
      }

      let headers = {
        'User-Agent' : 'Super Agent/0.0.1',
      }

      let options = {
        url: 'https://api.imgflip.com/caption_image',
        method: 'POST',
        headers: headers,
        form: {
          template_id: 124276589,
          username: env.IMGFLIP_USER,
          password: env.IMGFLIP_PASS,
          max_font_size: '30px',
          boxes: [
            {
              text: text1,
              x: 190, // Hardcoded values to make drake meme work
              y: 10,
              width: 180,
              height: 180,
              color: '#ffffff',
              outline_color: '#000000'
            },
            {
              text: text2,
              x: 190,
              y: 130,
              width: 180,
              height: 180,
              color: '#ffffff',
              outline_color: '#000000'
            }
          ]
        },
      }

      request(options, (error, response, body) => {
        if (!error && response.statusCode == 200) {
          let resp = JSON.parse(body);

          try {
            msg.channel.send('© ' + (msg.member.nickname || msg.author.username) + ':\n' + resp['data']['url']);
          } catch (e) {
            msg.channel.send('Big **oof** my dude check the logs');
            console.log('imgflip error: \n' + e);
          }
        }
      });

      msg.delete().catch(console.error);
    }
  },
  spam: {
    desc: 'spam',
    args: 'spam',
    execute: (client, msg, args) => {
      let str = '';
      args.forEach(arg => { str += arg + ' ' });
      msg.delete().catch(console.error);
      for (i = 0 ; i < 5 ; i++) {
        msg.channel.send(str);
      }
    }
  },
  edrake: {
    desc: 'Generate a dank memay with emoji',
    args: '"Top Text" "Bottom Text"',
    execute: (client, msg, args) => {
      if (args.length < 2) return msg.channel.send("Small **oof** my dude please give me two inputs my dude");

      let str = '';

      args.forEach(arg => { str += arg + ' ' });

      memeText = str.match(/"([^"]|"")*"/g); // Array of all matches (text in "")

      try {
        var text1 = memeText[0].replace(/['"]+/g, ''); // Shitty quote removal
        var text2 = memeText[1].replace(/['"]+/g, '');
      } catch (e) {
        console.log('args error: \n' + e);
        return msg.channel.send('Small **oof** my dude check your quotes');
      }
      meme = '<:drakeno:420253513239494657> ' + text1 + '\n<:drakeyes:420253514116104198> ' + text2; // ids need to change if emoji deleted from csit++

      msg.channel.send(meme);
      msg.delete().catch(console.error);
    }
  }
};

//                                              ____________
//                               --)-----------|____________|
//                                             ,'       ,'
//               -)------========            ,'  ____ ,'
//                        `.    `.         ,'  ,'__ ,'
//                          `.    `.     ,'       ,'
//                            `.    `._,'_______,'__
//                              [._ _| ^--      || |
//                      ____,...-----|__________ll_|\
//     ,.,..-------"""""     "----'                 ||
// .-""  |=========================== ______________ |
//  "-...l_______________________    |  |'      || |_]
//                               [`-.|__________ll_|
//                             ,'    ,' `.        `.
//                           ,'    ,'     `.    ____`.
//               -)---------========        `.  `.____`.
//                                            `.        `.
//                                              `.________`.
//                              --)-------------|___________|
