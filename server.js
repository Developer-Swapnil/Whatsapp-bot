const qrcode = require("qrcode-terminal");
const express = require("express");
const { Client, LocalAuth } = require("whatsapp-web.js");
const { MessageMedia } = require("whatsapp-web.js");
// const fs = require("fs");
// const client = new Client();

const app = express();
const port = 3000;

//Enter your msg which you wanted to reply to and msg you wanted to send to.
const incomingMessage = "Hello";
let yourMessage = "Hi! How are you?";

//Enter your Number so that you won't recieve the bot messages
let contactNumber = "*********";

//Here for Indian no. i have used '91' if you are from other country use your country code
let serializedId = "91" + contactNumber + "@c.us";

app.listen(port, () => {
  console.log(`Server listening on the port::${port} `);
});

const allSessionsObject = {};
const client = new Client({
  puppeteer: {
    headless: false,
  },
  authStrategy: new LocalAuth({
    clientId: "Your_Client_ID",
  }),
});

client.on("qr", (qr) => {
  // qrcode.generate(qr, { small: true });
  console.log("QR Recieved", qr);
});

client.on("ready", () => {
  console.log("Client is ready!");
});
client.on("message", (message) => {
  console.log(message.body);
});
// client.on("message", (message) => {
//   if (message.body === "!ping") {
//     message.reply("pong");
//   }
// });

// Mention everyone
client.on("message", async (msg) => {
  const chat = await msg.getChat();
  if (chat.participants !== undefined && msg.body === incomingMessage) {
    let mentions = [];
    for (let participant of chat.participants) {
      const contact = await client.getContactById(participant.id._serialized);
      let chatId = contact.id._serialized;

      mentions.push(contact);

      // Sending message.
      if (chatId !== serializedId) {
        const media = MessageMedia.fromFilePath("image.jpg");
        client.sendMessage(chatId, media);
        client.sendMessage(chatId, yourMessage);
      }
    }
    // await chat.sendMessage(text, { mentions });
  } else {
    console.log("This msg is not from group chat");
  }
});
client.initialize();
