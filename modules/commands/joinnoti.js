module.exports.config = {
    name: "joinnoti",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "𝑽𝒖̃ 𝑻𝒂̀𝒊 (𝑺𝒕𝒂𝒘)",
    description: "Bật hoặc tắt thông báo khi có thành viên mới vào nhóm",
    commandCategory: "Quản Trị Viên",
    usages: "[on/off]",
    cooldowns: 5,
};

module.exports.run = async function({ api, event, Threads, args }) {
    const { threadID, messageID } = event;
    let threadData = await Threads.getData(threadID);
    let data = threadData.data || {};
    if (args.length === 0) {
        return api.sendMessage("Sử dụng joinnoti [on/off] để bật hoặc tắt thông báo khi có thành viên mới vào nhóm.", threadID, messageID);
    }
    if (args[0].toLowerCase() === "on") {
        data.joinNoti = true;
        await Threads.setData(threadID, { data });
        global.data.threadData.set(threadID, data);
        return api.sendMessage("Đã bật tự động thông báo thành viên mới tham gia cho nhóm này.", threadID, messageID);
    }
    if (args[0].toLowerCase() === "off") {
        data.joinNoti = false;
        await Threads.setData(threadID, { data });
        global.data.threadData.set(threadID, data);
        return api.sendMessage("Đã tắt tự động thông báo khi có thành viên mới tham gia cho nhóm này.", threadID, messageID);
    }
    return api.sendMessage("Lựa chọn không hợp lệ, vui lòng nhập đúng cú pháp joinnoti [on/off].", threadID, messageID);
};
