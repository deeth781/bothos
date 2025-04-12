const fs = require('fs-extra');
const path = require('path');

const pathData = path.join(__dirname, '../commands/cache/antinamebox.json');

const crFile = (f, i) => {
    if (!fs.existsSync(f)) {
        const data = i !== undefined ? JSON.stringify(i, null, 2) : JSON.stringify([]);
        fs.writeFileSync(f, data);
    }
};

crFile(pathData);

module.exports.config = {
    name: "antinamebox",
    version: "1.0.0",
    hasPermssion: 1,
    credits: "𝑽𝒖̃ 𝑻𝒂̀𝒊 (𝑺𝒕𝒂𝒘)",
    description: "Chống đổi tên nhóm",
    commandCategory: "Quản Trị Viên",
    usages: "antinameboxantinamebox",
    cooldowns: 0
};

module.exports.run = async ({ api, event, Threads }) => {
    const { threadID } = event;
    let read = await fs.readFile(pathData, 'utf-8');
    let antiData = read ? JSON.parse(read) : [];
    let threadEntry = antiData.find(entry => entry.threadID === threadID);

    if (threadEntry) {
        antiData = antiData.filter(entry => entry.threadID !== threadID);
        await fs.writeFile(pathData, JSON.stringify(antiData, null, 4), 'utf-8'); 
        api.sendMessage("✅ Đã tắt chế độ chống đổi tên nhóm", threadID);
    } else {
        const thread =  (await Threads.getInfo(threadID));
        const nameBox = thread.name; 

        const Data = { 
            threadID: threadID, 
            namebox: nameBox,
            report: {} 
        };
        antiData.push(Data);

        await fs.writeFile(pathData, JSON.stringify(antiData, null, 4), 'utf-8'); 
        api.sendMessage("✅ Đã bật chế độ chống đổi tên nhóm", threadID);
    }
};
