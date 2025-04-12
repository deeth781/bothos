const fs = require('fs-extra');
const path = require('path');

const pathData = path.join(__dirname, '../commands/cache/antiemoji.json');

const crFile = (f, i = []) => {
    if (!fs.existsSync(f)) {
        const data = JSON.stringify(i, null, 2);
        fs.writeFileSync(f, data);
    }
};

// Khởi tạo file nếu chưa tồn tại
crFile(pathData);

module.exports.config = {
    name: "antiemoji",
    version: "1.0.0",
    hasPermssion: 1,
    credits: "𝑽𝒖̃ 𝑻𝒂̀𝒊 (𝑺𝒕𝒂𝒘)",
    description: "Chống đổi emoji",
    commandCategory: "Quản Trị Viên",
    usages: "antiemoji",
    cooldowns: 0
};

module.exports.run = async ({ api, event, Threads }) => {
    const { threadID } = event;

    try {
        // Đọc dữ liệu từ file
        let antiData = await fs.readJSON(pathData);

        // Tìm kiếm thông tin nhóm trong danh sách
        let threadEntry = antiData.find(entry => entry.threadID === threadID);

        if (threadEntry) {
            // Nếu đã bật chế độ chống đổi emoji, tắt chế độ
            antiData = antiData.filter(entry => entry.threadID !== threadID);
            await fs.writeFile(pathData, JSON.stringify(antiData, null, 4), 'utf-8');
            api.sendMessage("✅ Đã tắt chế độ chống đổi emoji", threadID);
        } else {
            // Lấy emoji hiện tại của nhóm
            const threadInfo = await Threads.getInfo(threadID);
            const emoji = threadInfo.emoji;

            // Thêm thông tin nhóm và emoji hiện tại vào danh sách
            antiData.push({ threadID, emoji });
            await fs.writeFile(pathData, JSON.stringify(antiData, null, 4), 'utf-8');
            api.sendMessage("✅ Đã bật chế độ chống đổi emoji", threadID);
        }
    } catch (error) {
        console.error("Lỗi khi bật/tắt chế độ chống đổi emoji:", error);
        api.sendMessage("❌ Đã xảy ra lỗi trong quá trình xử lý.", threadID);
    }
};
