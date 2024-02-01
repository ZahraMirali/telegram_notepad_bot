const TelegramBot = require("node-telegram-bot-api");
const fs = require("fs");
const { TOKEN } = require("./token");

const bot = new TelegramBot(TOKEN, { polling: true });

let notepadData = {};

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    "Hi! I am your Notepad Bot. Send me messages, and I will save them in a notepad file."
  );
});

bot.onText(/\/end/, (msg) => {
  const chatId = msg.chat.id;

  for (const title in notepadData) {
    fs.appendFileSync("notepad.txt", notepadData[title]);
  }

  notepadData = {};

  bot.sendMessage(chatId, "All items written to the notepad file.");
});

bot.on("message", (msg) => {
  if (msg.forward_origin) {
    const chatId = msg.chat.id;
    const text = getText(msg);
    notepadData[text.split(":")[0]] = text;
    bot.sendMessage(chatId, Object.keys(notepadData).length);
  }
});

function getText(msg) {
  let text = "";
  try {
    if (msg.forward_origin.chat.username === "Vocabulix" && msg.caption) {
      const captionLines = msg.caption.split("\n");
      let title = captionLines[0].replace(/🔵/g, "").trim();
      title = title[0].toUpperCase() + title.slice(1);
      const description = captionLines[2].replace(/♦️/g, "").trim();
      const example = captionLines[5].split('"')[1].trim();

      text = `${title}: ${description}. ${title}. ${title}. ${title}. \nExample: ${example}\n\n`;
    }
  } catch (error) {}
  return text;
}
