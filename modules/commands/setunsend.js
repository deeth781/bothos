const fs = require('fs-extra');
const path = require('path');

module.exports.config = {
  name: "setunsend",
  version: "1.0.0",
  hasPermssion: 1,
  Rent: 2,
  credits: "𝑽𝒖̃ 𝑻𝒂̀𝒊 (𝑺𝒕𝒂𝒘)",
  description: "Cài đặt icon để gỡ tin nhắn bot",
  commandCategory: "Nhóm",
  usages: "setUnsend + icon",
  cooldowns: 5
};

const Unsend = "./modules/commands/data/unsend.json"

if (!fs.existsSync(Unsend)) {
  fs.writeFileSync(Unsend, JSON.stringify([]));
}

module.exports.run = async ({ api, event, args }) => {
  const threadID = event.threadID;
  const input = args[0];

  try {
    let read = await fs.readFile(Unsend, 'utf-8');
    let unSend = read ? JSON.parse(read) : [];
    let threadEntry = unSend.find(entry => entry.threadID === threadID);

    if (input === "rm") {
      if (threadEntry) {
        unSend = unSend.filter(entry => entry.threadID !== threadID);
        await fs.writeFile(Unsend, JSON.stringify(unSend, null, 4), 'utf-8');
        api.sendMessage("Đã xóa unsend", threadID);
      } else {
        api.sendMessage("chưa set unsend", threadID);
      }
    } else {
      if (!input && input.length >1) {
        api.sendMessage('‣ Vui lòng nhập icon!', event.threadID, event.messageID);
        return;
      }
      // console.log(input.length)
      if (input.length > 2) return api.sendMessage(` Chỉ được phép nhập 1 icon!!`,event.threadID)

      if (!isNaN(input) || input.match(/[a-zA-Z/"';+.,!@#$%^&*(){}[\]<>?_=|~`]/)) {
        api.sendMessage('‣ Vui lòng nhập icon không chứa ký tự đặc biệt!', event.threadID, event.messageID);
        return;
      }

      if (!threadEntry) {
        const Data = {
          threadID: threadID,
          Icon: input
        };
        unSend.push(Data);
      } else {
        threadEntry.Icon = input
      }
      await fs.writeFile(Unsend, JSON.stringify(unSend, null, 4), 'utf-8');
      api.sendMessage("Đã setUnsend thành công", threadID);
    }
  } catch (error) {
    console.error('Lỗi:', error);
    api.sendMessage("Đã xảy ra lỗi", threadID);
  }
};
