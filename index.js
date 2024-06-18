const { Bot, consts, utils } = require("nullcord");
const { sigint } = require("gxlg-utils");
const fs = require("fs");

const token = fs.readFileSync(".token", "utf-8").trim();
const bot = new Bot(token, { "internal": true });

let status;
let current = "guilds";
function setStatus(guilds) {
  if (current == "guilds") {
    bot.setStatus({
      "status": "dnd",
      "since": 0,
      "afk": false,
      "activities": [{
        "name": "coding in " + (guilds ?? bot.guildsCount()) + " guilds",
        "type": consts.activity_types.Game
      }]
    });
    current = "fact";
  } else if (current == "fact") {
    // TODO: add command to suggest new funny/interesting facts
    bot.setStatus({
      "status": "dnd",
      "since": 0,
      "afk": false,
      "activities": [{
        "name": "👀 Coming soon...",
        "type": consts.activity_types.Watching
      }]
    });
    current = "guilds";
  }
}

bot.events["READY"] = async data => {
  bot.logger.sinfo(data.shard[0], "Got ready!");

  if (bot.ready()) {
    bot.logger.info("Bot logged in as", data.user.username);
    setStatus(data.guilds.length);
    status = setInterval(setStatus, 15000);
  }
};

bot.login(utils.autoIntents({ bot, "guilds_count": true }));

sigint(async () => {
  bot.logger.info("Ctrl-C");
  clearInterval(status);
  await bot.destroy();
});
