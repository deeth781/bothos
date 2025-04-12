const request = require("request");
const fs = require("fs");
module.exports.config = {
  name: "dỗi",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝑽𝒖̃ 𝑻𝒂̀𝒊 (𝑺𝒕𝒂𝒘)",
  description: "ngỏ lời",
  commandCategory: "Thành Viên",
  usages: "[tag]",
  cooldowns: 5,
};

module.exports.run = async({ api, event }) => {
  const link = [
    "https://i.imgur.com/kljyQPh.gif"   
  ];
  if (!event.mentions || Object.keys(event.mentions).length === 0) {
    return api.sendMessage("Vui lòng tag 1 người", event.threadID, event.messageID);
  }
  const mention = Object.keys(event.mentions)[0];
  const tag = event.mentions[mention].replace("@", "");
  const chosenLink = link[Math.floor(Math.random() * link.length)];
  const extension = chosenLink.split('.').pop();
  const filePath = __dirname + `/cache/doi.${extension}`;
  const callback = () => {
    api.sendMessage({
      body: `Dỗi ${tag} ToT`,
      mentions: [{ tag: tag, id: mention }],
      attachment: fs.createReadStream(filePath)
    }, event.threadID, () => fs.unlinkSync(filePath));
  };
  return request(encodeURI(chosenLink))
    .pipe(fs.createWriteStream(filePath))
    .on("close", () => callback());
};
