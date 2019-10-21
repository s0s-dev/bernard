const bot_secret = require("./lib/bot-secret")
const bot = require("./lib/bot")

const fs = require('fs')

const discord = require('discord.js')
const client = new discord.Client()
var bernard = new bot()

const chan_questions = "635737039517777931"
var paused_channels = []

process.on('uncaughtException', function(err) {
  bernard.log(err)
  console.log(err)
})

client.on('ready', () => {
  bernard.log("Connected as " + client.user.tag)

  bernard.name("bernard")
  bernard.default_reply("...")
  bernard.keywords("")
  bernard.rating("G")

  var nowPlayingText = "It doesn't look like anything to me" 
  client.user.setActivity(nowPlayingText)

})

client.on('messageReactionAdd', (reaction, user) => {
    var username = user.username.toLowerCase()
    console.log(user.id)

    var react = reaction
    //var message = reaction.messageReaction

    //console.log(react)
    var msg = {}
    msg.author = reaction.author
    msg.channel = reaction.channel
    msg.date = reaction.createdTimestamp
    msg.content = reaction.content
    msg.reactions = reaction.reactions
    //console.log(msg)

    console.log(reaction.emoji.name)
    //console.log(reaction.message)

    console.log("Is Anna in this channel")
    console.log(isAnnaInThisChannel(reaction.message))

    console.log("Did Anna send this message?")
    console.log(didAnnaSendThisMessage(reaction.message))

    if (reaction.emoji.name === "❔") { 
      if (isAnnaInThisChannel(reaction.message)) {
        if (!(didAnnaSendThisMessage(reaction.message))) {
          // Pause Anna
          if (!(isPaused(reaction.message.channel.id))) {
            reaction.message.channel.send("<@!581973598302896254> pause") //hardcoded == bad === works
            console.log(reaction.message.channel.id)
            pause(reaction.message.channel.id)
          }

          // Notify $0$ that there was a question by posting it in the questions channel
          // this could tag people or @here in the future 
          var questionsChannel = client.channels.get(chan_questions)
          questionsChannel.send("\"" + reaction.message.content + "\" in <#" + reaction.message.channel.id + ">")
        }
      }
    }
})

// Reply to messages
client.on('message', (receivedMessage) => {
  // Prevent bot from responding to its own messages
  if (receivedMessage.author == client.user) { return } // catch and release

  var msg = receivedMessage.content
  if (msg) {
    msg = msg.toLocaleLowerCase()
    msg = msg.replace(/<@![0-9]*> /g,"").replace("<@!581973598302896254> ","")

    if ((msg == "start") || (msg == "resume") || (msg == "continue")) {
      console.log("Resumed")
      resume(receivedMessage.channel.id)
    }
  }
})

function pause(chan) {
  paused_channels.push(chan)
}

function resume(chan) {
  if (paused_channels) {
    for (var i = 0; i < paused_channels.length; i++) {
      console.log(paused_channels[i])
      if (chan == paused_channels[i]) {
        paused_channels.splice(i,1)
      }
    }
  }
}

function isPaused(chan) {
  var retVal = false
  for (var i in paused_channels) {
    if (paused_channels[i] == chan) {
      retVal = true
    }
  }
  return retVal
}

function stripPunctuation(text) {
  var tmp = text.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"")
  //tmp = tmp.replace(/\s{2,}/g," ")
  return tmp
}


function didAnnaSendThisMessage(msg) {
  var anna = false
  var sender = stripPunctuation(msg.author.username)

  if (sender.toLowerCase() == "annabot") { anna = true } 

  return anna
}
  
function isAnnaInThisChannel(msg) {
  var channel_name = msg.channel.name
  var anna = false
  var channelsAnna = fs.readFileSync("../anna/conf/channels.txt").toString().split("\n")

  for (i in channelsAnna) {
    if (channel_name == channelsAnna[i]) {
    anna = true
    }
  }
  return anna
}


client.login(bot_secret.bot_secret_token)
