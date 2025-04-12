const axios = require('axios');
const fs = require('fs');

module.exports.config = {
	name: "emojimix",
	version: "1.0.0", 
	hasPermssion: 0,
	credits: "𝑽𝒖̃ 𝑻𝒂̀𝒊 (𝑺𝒕𝒂𝒘)", 
	description: "Mix emoji sử dụng Emoji Kitchen",
	commandCategory: "Tiện ích",
	usages: "emojimix <emoji1> <emoji2>",
	cooldowns: 5,
};

module.exports.run = async function({ api, event, args }) {
  const readStream = [];
  const emoji1 = args[0];
  const emoji2 = args[1];
  if (!emoji1 || !emoji2) {
    return api.sendMessage('⌧ · Vui lòng nhập emoji hợp lệ', event.threadID, event.messageID);
  }

  try {
    const generate1 = await generateEmojimix(emoji1, emoji2);
		const generate2 = await generateEmojimix(emoji2, emoji1);

		if (generate1)
			readStream.push(generate1);
		if (generate2)
			readStream.push(generate2);
  api.sendMessage({
    body: `☑︎ · Mix thành công ${emoji1} và ${emoji2}`,
    attachment: readStream
   }, event.threadID, event.messageID)
  } catch (err) {
    api.sendMessage(`⌧ · Không thể mix ${emoji1} và ${emoji2}`, event.threadID, event.messageID)
   }
}

async function generateEmojimix(emoji1, emoji2) {
	try {
		const { data: response } = await axios.get("https://goatbotserver.onrender.com/taoanhdep/emojimix", {
			params: {
				emoji1,
				emoji2
			},
			responseType: "stream"
		});
		response.path = `emojimix${Date.now()}.png`;
		return response;
	}
	catch (e) {
		return null;
	}
}