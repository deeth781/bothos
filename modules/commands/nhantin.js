const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.config = {
  name: "nhantin",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝑽𝒖̃ 𝑻𝒂̀𝒊 (𝑺𝒕𝒂𝒘)",
  description: "Gửi tin nhắn tới một người dùng qua ID Facebook",
  commandCategory: "Thành Viên",
  usages: "[userID] [noidung]\nBạn có thể reply ảnh mà bạn muốn gửi kèm",
  cooldowns: 10
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, senderID } = event;
  const [id, ...contentArgs] = args;
  const content = (contentArgs.length !== 0) ? contentArgs.join(" ") : "Hi chao cau";

  if (!id) {
    return api.sendMessage('Vui lòng nhập ID của người mà bạn muốn bot gửi tin nhắn đến!', threadID, messageID);
  }

  if (event.type == "message_reply" && event.messageReply.attachments.length > 0) {
    const attachmentURL = event.messageReply.attachments[0].url;

    const cachePath = path.join(__dirname, 'cache');
    const fileName = `attachment_${Date.now()}.jpg`;

    const response = await axios.get(attachmentURL, { responseType: 'arraybuffer' });
    fs.writeFileSync(path.join(cachePath, fileName), Buffer.from(response.data));

    api.sendMessage({ attachment: fs.createReadStream(path.join(cachePath, fileName)), body: content }, id);

  } else {
    api.sendMessage(content, id);
  }
}
