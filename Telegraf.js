const Telegraf = require('node-telegram-bot-api');
const { ttdl } = require('btch-downloader');
const util = require('util');
const chalk = require('chalk');
const figlet = require('figlet');
const express = require('express'); 
const app = express();
const port = process.env.PORT || 8080;

// express 
app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  const data = {
    status: 'true',
    message: 'Bot Successfully Activated!',
    author: 'SATRIADEV'
  };
  const result = {
    response: data
  };
  res.send(JSON.stringify(result, null, 2));
});

function listenOnPort(port) {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
app.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} is already in use. Trying another port...`);
      listenOnPort(port + 1);
    } else {
      console.error(err);
    }
  });
}

listenOnPort(port);

// Bot config token 
let token = '7395604866:AAG5eHFUGKs57xxD5AmJjfLnRvp_wMQH-DM'  //replace this part with your bot token
const bot = new Telegraf(token, { polling: true });
let Start = new Date();

const logs = (message, color) => {
  const timestamp = new Date().toLocaleTimeString();
  console.log(chalk[color](`[${timestamp}] => ${message}`));
};

const Figlet = () => {
  figlet('tiktokdl', { font: 'Block', horizontalLayout: 'default' }, function (err, data) {
    if (err) {
      console.log('Error:', err);
      return;
    }
    console.log(chalk.yellow.bold(data));
    console.log(chalk.yellow(`SATRIADEV`));
  });
};

bot.on('polling_error', (error) => {
  logs(`Polling error: ${error.message}`, 'blue');
});

// set menu
bot.setMyCommands([
	{
		command: '/start',
		description: 'Start a new conversation'
	},
	{
		command: '/runtime',
		description: 'Check bot runtime'
	}
 ]);

// command
bot.onText(/^\/runtime$/, (msg) => {
  const now = new Date();
  const uptimeMilliseconds = now - Start;
  const uptimeSeconds = Math.floor(uptimeMilliseconds / 1000);
  const uptimeMinutes = Math.floor(uptimeSeconds / 60);
  const uptimeHours = Math.floor(uptimeMinutes / 60);

  const From = msg.chat.id;
  const uptimeMessage = `Active : ${uptimeHours} hour ${uptimeMinutes % 60} minute ${uptimeSeconds % 60} second.`;

  bot.sendMessage(From, uptimeMessage);
});
bot.onText(/^\/start$/, (msg) => {
const From = msg.chat.id;
const caption = `ℹ Dengan Bot ini Anda dapat dengan mudah dan cepat mengunduh konten seperti: Video dan Musik dari jejaring Sosial TikTok.
Yang Anda butuhkan hanyalah mengirimkan tautan ke Bot!`
bot.sendMessage(From, caption);
});

bot.on('message', async (msg) => {
  Figlet();
  logs('Success activated', 'green');
  const From = msg.chat.id;
  const body = /^https:\/\/.*tiktok\.com\/.+/;
   if (body.test(msg.text)) {
    const url = msg.text;
    try {        
        const data = await ttdl(url)
        const audio = data.audio[0]
        const { title, title_audio } = data;
        await bot.sendVideo(From, data.video[0], { caption: title });
        await sleep(3000)
        await bot.sendAudio(From, audio, { caption: title_audio });
        await sleep(3000)
        await bot.sendMessage(From, 'Powered by @satriadevx');
    } catch (error) {
        bot.sendMessage(From, 'Maaf, terjadi kesalahan saat mengunduh video TikTok.');
        logs(`[ ERROR ] ${From}: ${error.message}`, 'red');
    }
}
})

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
