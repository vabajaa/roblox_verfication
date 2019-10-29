//please only edit the config unless you know JS 



//config
const customKey = "yesthisisacustomkey"//custom key, must match the roblox version
const discordToken = "NjEzNTc4NTI4NjEyNjc5NzEw.XbhlyA.I3kpDi1KpTuvqJw5i6DNDN_5zk8"//discord token
const discordPrefix = "!"//discord bot prefix
const gameLink = "https://www.roblox.com/games/4231503788/vabajaas-Place-Number-219" //link to your roblox game































function pending(message) {
  let args = message.content.split(" ")

  if (args[1] && message && message.author.id) {
    let table = {
      robloxUsername: args[1],
      discord: message.author.id,
      time: Date.now()
    }

    try {
      let data = JSON.parse(fs.readFileSync(`./data/pending.json`))
      let canRun = true 

      data.forEach( user => {
        if (user.discord == message.author.id) {
          canRun = false
        }
      })

      if (canRun) {
        data.push(table)

        fs.writeFileSync('./data/pending.json', JSON.stringify(data), [])

        message.reply("Please join this roblox game to verify \n \n" + gameLink )
      } else {
        message.reply("You cannot verify while you already have a pending account.")
      }
    } catch(er) {
      console.log(er)
      message.reply("There's been an error while attempting to verify")
    }
  }
}



const express = require("express");
const app = express();
const fs = require('fs')
const Discord = require('discord.js')

let client = new Discord.Client();

app.use(express.static("public"));
app.use(express.json())


const listener = app.listen(process.env.PORT, function() {
  console.log('Watching port')
});



let uuid = require('uuid')

const siteKey = uuid()

app.get("/", function(req, res) {
  res.send("sorry but no")
});

app.get(`/ping`, function(req,res) {
  res.send('ok')
})

app.post(`/api/verify`, async function(req,res) {
  let opt = req.body

  console.log(opt)

  if (opt.key && opt.user && opt.id) {
    if (opt.key == siteKey) {
      try {
        const pendingData = JSON.parse(fs.readFileSync(`./data/pending.json`))
        
        
        const searchPending = new Promise(async (resolve, reject) => {
          pendingData.forEach( (user,index,array) => {
            if (user.robloxUsername == opt.user) {
              pendingObject = user
              pendingData.splice(index, 1)
              fs.writeFileSync('./data/pending.json', JSON.stringify(pendingData), [])
              resolve(user)
              return
            }
            if (array.size == index) {
              resolve()
            }
          })
        })

        searchPending.then( user => {
          if (user) {
            let verifiedData = JSON.parse(fs.readFileSync(`./data/verified.json`))

            verifiedData.push({
              robloxUsername: user.robloxUsername,
              roblox: user.roblox,
              discord: user.discord
            })
  
            fs.writeFileSync('./data/verified.json', JSON.stringify(verifiedData), [])
  
            res.json({})
          } else {
            res.json({erorr:true})
          }
        })

      } catch(er) {
        console.log(er)
        res.json({error:true})
      }
    } else {

    }
  } else {
    res.json({error:true})
  }
})

app.post(`/api/check`, function(req,res) {
  let opt = req.body

  console.log(opt)

  if (opt.key && opt.user) {
    if (opt.key == siteKey) {
      try {
        const pendingData = JSON.parse(fs.readFileSync(`./data/pending.json`))
        const verifiedData = JSON.parse(fs.readFileSync(`./data/verified.json`))
        
        let verified = false
        let pending = false 

        pendingData.forEach(user => {
          if (user.robloxUsername == opt.user) {
            pending = true
          }
        })

        verifiedData.forEach(user => {
          if (user.robloxUsername == opt.user) {
            verified = true
          }
        })

        res.json({
          verified: verified,
          pending: pending
        })

      } catch(er) {
        console.log(er)
        res.json({error:true})
      }
    } else {
      console.log("mismatched site keys")
      res.json({error:true})
    }
  } else {
    console.log('no user/thingy')
    res.json({error:true})
  }
})

app.post(`/api/getkey`, function(req,res) {
  if (!req.body.key) {
    res.json({error:true})
    return
  }

  if (req.body.key == customKey) {
    res.json({key:siteKey})
  } else {
    res.json({error:"Mismatch"})
  }
})


// discord.js stuff


client.on('ready', () => {
  console.log("Logged into account " + client.user.tag)
})

client.on('message', async message => {
  if (message.channel.type == "dm" && message.author.id != client.user.id) {
    let embed = new Discord.RichEmbed();

    embed.setTitle("**ROBLOX DISCORD VERIFICATION**")
    embed.setColor('#5b9cc2')
    embed.setFooter("Roblox Discord Verification | Created by vabajaa#3220")
    embed.setTimestamp()
    embed.setThumbnail('https://cdn.discordapp.com/attachments/475475163148713994/638237555262750732/Discord-Logo-White.png')
    embed.setDescription("This is a roblox discord verification bot created by vabajaa#3220 on discord")

    message.author.send(embed)
    return
  }

  let args = message.content.split(" ")
  if (args[0] == discordPrefix + "verify") {
    if (args[1]) {
      pending(message)
    } else {
      message.reply("Please specify a ROBLOX account \n \nexample: !verify " + client.user.username.replace(/ /g,""))
    }
  }
})

client.login(discordToken)