module.exports.config = {
    hasPermssion: 1, 
    credits: "𝑽𝒖̃ 𝑻𝒂̀𝒊 (𝑺𝒕𝒂𝒘)",
    name: "antispam", 
    commandCategory: "Quản Trị Viên",
    usages: "set/on/off [count] [time]",
    version: "1.0.0", 
    cooldowns: 0,
    description: 'Tự động kick người dùng khi spam trong nhóm',
};

const fs = require("fs-extra");
let antiSpamStatus = {};
let usersSpam = {};
const path = "./modules/commands/cache/data/antispamStatus.json";

module.exports.handleEvent = async function({ api, event }) {
    const { threadID, senderID } = event;
    if (!fs.existsSync(path)) {
        antiSpamStatus = {};
        fs.writeFileSync(path, JSON.stringify(antiSpamStatus));
    } else {
        antiSpamStatus = JSON.parse(fs.readFileSync(path));
    }
    let settings = antiSpamStatus[event.threadID]; 
    if (!settings || !settings.status) return;
    if (!usersSpam[senderID]) {
        usersSpam[senderID] = {
            count: 0,
            start: Date.now()
        };
    }
    usersSpam[senderID].count++;
    if (Date.now() - usersSpam[senderID].start > settings.spamTime) {
        if (usersSpam[senderID].count > settings.spamCount && settings.status) {
            api.removeUserFromGroup(senderID, threadID);
            api.sendMessage({
                body: `𝑻𝒉𝒊́𝒄𝒉 𝑺𝒑𝒂𝒎 𝑲𝒉𝒐̂𝒏𝒈??`,
                mentions: [{
                    tag: `${senderID}`,
                    id: senderID
                }]
            }, threadID);
        }
        usersSpam[senderID].count = 0;
        usersSpam[senderID].start = Date.now();
    }
};
module.exports.run = async function ({event, api, args}) {
    let infoThread = await api.getThreadInfo(event.threadID);
    let adminIDs = infoThread.adminIDs.map(e => e.id);
    var idBot = api.getCurrentUserID();
    switch(args[0]) {
        case "set":
            if (!adminIDs.includes(idBot)) {
                api.sendMessage("Bot không phải là quản trị viên trong nhóm nên không thể cài đặt cấu hình!", event.threadID);
                return;
            }
            let newCount = parseInt(args[1]);
            let newTime = parseInt(args[2]);
            if (!newCount || !newTime) {
                api.sendMessage("Vui lòng cung cấp cả số lần tin nhắn và thời gian hợp lệ (tính bằng mili giây)", event.threadID);
                return;
            }
            antiSpamStatus[event.threadID] = {
                spamCount: newCount,
                spamTime: newTime,
                status: false
            };
            fs.writeFileSync(path, JSON.stringify(antiSpamStatus));
            api.sendMessage(`Done✓`, event.threadID);
            break;
        case "on":
            if (!adminIDs.includes(idBot)) {
                api.sendMessage("Bot không phải là quản trị viên trong nhóm nên không thể kích hoạt chế độ chống spam", event.threadID);
                return;
            }
            if (!antiSpamStatus[event.threadID]) {
                api.sendMessage("Vui lòng sử dụng 'antispam set [count] [time]", event.threadID);
                return;
            }
            antiSpamStatus[event.threadID].status = true;
            fs.writeFileSync(path, JSON.stringify(antiSpamStatus));
            api.sendMessage('Đã bật chế độ chống spam!', event.threadID);
            break;
        case "off":
            if (antiSpamStatus[event.threadID]) {
                antiSpamStatus[event.threadID].status = false;
                fs.writeFileSync(path, JSON.stringify(antiSpamStatus));
                api.sendMessage('Đã tắt chế độ chống spam!', event.threadID);
            }
            break;
        default:
            api.sendMessage("Sử dụng antispam set/on/off [count] [time]", event.threadID);
    }
};