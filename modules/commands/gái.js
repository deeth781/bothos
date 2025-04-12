module.exports.config = {
  name: "gái",	
  version: "4.0.0", 
  hasPermssion: 0,
  credits: "𝑽𝒖̃ 𝑻𝒂̀𝒊 (𝑺𝒕𝒂𝒘)",
  description: "gái", 
  commandCategory: "Ảnh",
  usages: "gái",
  cooldowns: 0
};

module.exports.run = async ({ api, event, args, Threads }) => {
  const request = require('request');
  const fs = require("fs");
  const tdungs = [
    require('./../../includes/datajson/gaivip.json'),
    require('./../../includes/datajson/gaivip.json'),
    require('./../../includes/datajson/gaivip.json'),
    require('./../../includes/datajson/gaivip.json'),
    require('./../../includes/datajson/gaivip.json'),
    require('./../../includes/datajson/gaivip.json'),
    require('./../../includes/datajson/gaivip.json'),
    require('./../../includes/datajson/gaivip.json'),
    require('./../../includes/datajson/gaivip.json')
  ];

  function vtuanhihi(image, vtuandz, callback) {
    request(image).pipe(fs.createWriteStream(__dirname + `/` + vtuandz)).on("close", callback);
  }

    const numImages = Math.floor(Math.random() * 15) + 1;
    let imagesDownloaded = 0;
    let attachments = [];

    for (let i = 0; i < numImages; i++) {
      const randomTdung = tdungs[Math.floor(Math.random() * tdungs.length)];
      let image = randomTdung[Math.floor(Math.random() * randomTdung.length)].trim();
      let imgFileName = `image_${i}.png`;
      vtuanhihi(image, imgFileName, () => {
          imagesDownloaded++;
          attachments.push(fs.createReadStream(__dirname + `/${imgFileName}`));
          if (imagesDownloaded === numImages) {
            api.sendMessage({
              body: `Tha hồ ngắm=)))`,
              attachment: attachments
            }, event.threadID, () => {

              for (let img of attachments) {
                fs.unlinkSync(img.path); 
              }
            }, event.messageID);
          }
      });
    }
}