const bot_secret = require("./lib/bot-secret")
const bot = require("./lib/bot")

const fs = require('fs')

const discord = require('discord.js')
const client = new discord.Client()
var bernard = new bot()

process.on('uncaughtException', function(err) {
  bernard.log(err)
  console.log(err)
})

var greeting = ""
var questionWords = []
client.on('ready', () => {
  bernard.log("Connected as " + client.user.tag)

  bernard.name("bernard")
  bernard.default_reply("...")
  bernard.keywords("")
  bernard.rating("G")

  var nowPlayingText = "It doesn't look like anything to me" 
  client.user.setActivity(nowPlayingText)

})

// Reply to messages
client.on('message', (receivedMessage) => {
  // Prevent bot from responding to its own messages
  if (receivedMessage.author == client.user) { return } // catch and release

})


client.login(bot_secret.bot_secret_token)
