const TelegramBot = require("node-telegram-bot-api");
const fs = require("fs");
const { TOKEN } = require("./token");

const bot = new TelegramBot(TOKEN, { polling: true });

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    "Hi! I am your Notepad Bot. Send me messages, and I will save them in a notepad file."
  );
});

bot.on("message", (msg) => {
  if (msg.forward_origin) {
    const chatId = msg.chat.id;

    const text = getText(msg);

    fs.appendFile("notepad.txt", text, (err) => {
      if (err) {
        bot.sendMessage(chatId, "Error saving forwarded message to Notepad.");
      } else {
        bot.sendMessage(chatId, text.split(":")[0]);
      }
    });
  }
});

function getText(msg) {
  let text = "";
  if (msg.forward_origin.chat.username === "Vocabulix" && msg.caption) {
    const captionLines = msg.caption.split("\n");
    let title = captionLines[0].replace(/🔵/g, "").trim();
    title = title[0].toUpperCase() + title.slice(1);
    const description = captionLines[2].replace(/♦️/g, "").trim();
    const example = captionLines[5].split('"')[1].trim();

    text = `${title}: ${description}. ${title}. ${title}. ${title}. \nExample: ${example}\n\n`;
  }

  return text;
}
